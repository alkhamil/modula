package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"modula-server/internal/auth"
	"modula-server/internal/builder"
	"modula-server/internal/config"
	"modula-server/internal/crud"
	"modula-server/internal/project"
)

type contextKey string

const userContextKey contextKey = "currentUser"

type API struct {
	cfg      *config.Config
	builder  *builder.Manager
	crud     *crud.Engine
	auth     *auth.Manager
	projects *project.Manager
}

func NewAPI(cfg *config.Config, b *builder.Manager, c *crud.Engine, a *auth.Manager, p *project.Manager) *API {
	return &API{
		cfg:      cfg,
		builder:  b,
		crud:     c,
		auth:     a,
		projects: p,
	}
}

func (a *API) sendJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(data)
}

func (a *API) sendError(w http.ResponseWriter, status int, message string) {
	a.sendJSON(w, status, map[string]string{"error": message})
}

// HealthCheck endpoint.
func (a *API) HealthCheck(w http.ResponseWriter, r *http.Request) {
	a.sendJSON(w, http.StatusOK, map[string]interface{}{
		"status":    "healthy",
		"service":   "modula-backend-go",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
	})
}

// ExtractToken mengambil token dari header Authorization (Bearer <token>) atau x-auth-token.
func (a *API) ExtractToken(r *http.Request) string {
	authHeader := r.Header.Get("Authorization")
	if strings.HasPrefix(strings.ToLower(authHeader), "bearer ") {
		return strings.TrimSpace(authHeader[7:])
	}
	if tok := r.Header.Get("x-auth-token"); tok != "" {
		return strings.TrimSpace(tok)
	}
	return ""
}

// CurrentUser mengembalikan data profil pengguna aktif dari request context.
func (a *API) CurrentUser(r *http.Request) *auth.UserResponse {
	if val := r.Context().Value(userContextKey); val != nil {
		if u, ok := val.(*auth.UserResponse); ok {
			return u
		}
	}
	return nil
}

// WithAuth middleware untuk memvalidasi token sesi pengguna.
func (a *API) WithAuth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		token := a.ExtractToken(r)
		if token == "" {
			a.sendError(w, http.StatusUnauthorized, "Autentikasi diperlukan. Silakan masuk terlebih dahulu.")
			return
		}

		user, err := a.auth.ValidateToken(token)
		if err != nil {
			a.sendError(w, http.StatusUnauthorized, err.Error())
			return
		}

		ctx := context.WithValue(r.Context(), userContextKey, user)
		next(w, r.WithContext(ctx))
	}
}

// -------------------------------------------------------------
// AUTH ENDPOINTS (/api/v1/auth)
// -------------------------------------------------------------

// Login endpoint: POST /api/v1/auth/login
func (a *API) Login(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		a.sendError(w, http.StatusBadRequest, "Payload JSON tidak valid")
		return
	}

	user, token, err := a.auth.Login(payload.Email, payload.Password)
	if err != nil {
		a.sendError(w, http.StatusUnauthorized, err.Error())
		return
	}

	a.sendJSON(w, http.StatusOK, map[string]interface{}{
		"token": token,
		"user":  user,
	})
}

// Logout endpoint: POST /api/v1/auth/logout
func (a *API) Logout(w http.ResponseWriter, r *http.Request) {
	token := a.ExtractToken(r)
	if token != "" {
		a.auth.Logout(token)
	}
	a.sendJSON(w, http.StatusOK, map[string]string{"message": "Berhasil keluar"})
}

// Me endpoint: GET /api/v1/auth/me
func (a *API) Me(w http.ResponseWriter, r *http.Request) {
	user := a.CurrentUser(r)
	if user == nil {
		a.sendError(w, http.StatusUnauthorized, "Pengguna tidak terautentikasi")
		return
	}
	a.sendJSON(w, http.StatusOK, user)
}

// -------------------------------------------------------------
// USER MANAGEMENT ENDPOINTS (/api/v1/users)
// -------------------------------------------------------------

// ListUsers endpoint: GET /api/v1/users (Khusus Admin / Super Admin)
func (a *API) ListUsers(w http.ResponseWriter, r *http.Request) {
	user := a.CurrentUser(r)
	if user == nil || (user.Role != auth.RoleSuperAdmin && user.Role != auth.RoleAdmin) {
		a.sendError(w, http.StatusForbidden, "Hanya Administrator yang memiliki akses ke daftar pengguna")
		return
	}

	list, err := a.auth.ListUsers()
	if err != nil {
		a.sendError(w, http.StatusInternalServerError, err.Error())
		return
	}
	a.sendJSON(w, http.StatusOK, list)
}

// CreateUser endpoint: POST /api/v1/users (Khusus Admin / Super Admin)
func (a *API) CreateUser(w http.ResponseWriter, r *http.Request) {
	user := a.CurrentUser(r)
	if user == nil || (user.Role != auth.RoleSuperAdmin && user.Role != auth.RoleAdmin) {
		a.sendError(w, http.StatusForbidden, "Hanya Administrator yang dapat mendaftarkan akun internal baru")
		return
	}

	var payload struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Password string `json:"password"`
		Role     string `json:"role"`
	}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		a.sendError(w, http.StatusBadRequest, "Payload JSON tidak valid")
		return
	}

	created, err := a.auth.CreateUser(payload.Name, payload.Email, payload.Password, payload.Role)
	if err != nil {
		a.sendError(w, http.StatusBadRequest, err.Error())
		return
	}
	a.sendJSON(w, http.StatusCreated, created)
}

// UpdateUser endpoint: PUT /api/v1/users/{id}
func (a *API) UpdateUser(w http.ResponseWriter, r *http.Request) {
	user := a.CurrentUser(r)
	if user == nil || (user.Role != auth.RoleSuperAdmin && user.Role != auth.RoleAdmin) {
		a.sendError(w, http.StatusForbidden, "Hanya Administrator yang dapat mengubah data akun internal")
		return
	}

	id := r.PathValue("id")
	if id == "" {
		a.sendError(w, http.StatusBadRequest, "ID pengguna wajib disertakan")
		return
	}

	var payload struct {
		Name   string `json:"name"`
		Role   string `json:"role"`
		Status string `json:"status"`
	}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		a.sendError(w, http.StatusBadRequest, "Payload JSON tidak valid")
		return
	}

	updated, err := a.auth.UpdateUser(id, payload.Name, payload.Role, payload.Status)
	if err != nil {
		a.sendError(w, http.StatusBadRequest, err.Error())
		return
	}
	a.sendJSON(w, http.StatusOK, updated)
}

// -------------------------------------------------------------
// PROJECT WORKSPACE ENDPOINTS (/api/v1/projects)
// -------------------------------------------------------------

// ListWorkspaceProjects endpoint: GET /api/v1/projects
func (a *API) ListWorkspaceProjects(w http.ResponseWriter, r *http.Request) {
	user := a.CurrentUser(r)
	userID := ""
	userRole := ""
	if user != nil {
		userID = user.ID
		userRole = user.Role
	}

	list, err := a.projects.ListProjects(userID, userRole)
	if err != nil {
		a.sendError(w, http.StatusInternalServerError, err.Error())
		return
	}
	a.sendJSON(w, http.StatusOK, list)
}

// CreateWorkspaceProject endpoint: POST /api/v1/projects
func (a *API) CreateWorkspaceProject(w http.ResponseWriter, r *http.Request) {
	user := a.CurrentUser(r)
	userID := "usr-anonymous"
	userName := "Internal User"
	userEmail := "user@modula.io"
	if user != nil {
		userID = user.ID
		userName = user.Name
		userEmail = user.Email
	}

	var input project.Project
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		a.sendError(w, http.StatusBadRequest, "Payload JSON tidak valid")
		return
	}

	created, err := a.projects.CreateProject(userID, userName, userEmail, input)
	if err != nil {
		a.sendError(w, http.StatusBadRequest, err.Error())
		return
	}

	// Sinkronkan juga ke builder manager lama agar kompatibel
	_ = a.builder.Save(builder.ProjectMetadata{
		Name:          created.Name,
		Slug:          created.Slug,
		Theme:         created.Theme,
		PrimaryColor:  created.PrimaryColor,
		SelectedPacks: created.SelectedPacks,
		CreatedAt:     created.CreatedAt,
		Status:        "ready",
	})

	a.sendJSON(w, http.StatusCreated, created)
}

// GetWorkspaceProject endpoint: GET /api/v1/projects/{slug}
func (a *API) GetWorkspaceProject(w http.ResponseWriter, r *http.Request) {
	user := a.CurrentUser(r)
	userID := ""
	userRole := ""
	if user != nil {
		userID = user.ID
		userRole = user.Role
	}

	slug := r.PathValue("slug")
	proj, access, err := a.projects.GetProjectBySlug(slug, userID, userRole)
	if err != nil {
		a.sendError(w, http.StatusNotFound, err.Error())
		return
	}

	a.sendJSON(w, http.StatusOK, map[string]interface{}{
		"project":     proj,
		"accessLevel": access,
	})
}

// UpdateWorkspaceProject endpoint: PUT /api/v1/projects/{slug}
func (a *API) UpdateWorkspaceProject(w http.ResponseWriter, r *http.Request) {
	user := a.CurrentUser(r)
	if user == nil {
		a.sendError(w, http.StatusUnauthorized, "Autentikasi diperlukan")
		return
	}

	slug := r.PathValue("slug")
	var updates project.Project
	if err := json.NewDecoder(r.Body).Decode(&updates); err != nil {
		a.sendError(w, http.StatusBadRequest, "Payload JSON tidak valid")
		return
	}

	updated, err := a.projects.UpdateProject(slug, user.ID, user.Role, updates)
	if err != nil {
		a.sendError(w, http.StatusBadRequest, err.Error())
		return
	}
	a.sendJSON(w, http.StatusOK, updated)
}

// DeleteWorkspaceProject endpoint: DELETE /api/v1/projects/{slug}
func (a *API) DeleteWorkspaceProject(w http.ResponseWriter, r *http.Request) {
	user := a.CurrentUser(r)
	if user == nil {
		a.sendError(w, http.StatusUnauthorized, "Autentikasi diperlukan")
		return
	}

	slug := r.PathValue("slug")
	if err := a.projects.DeleteProject(slug, user.ID, user.Role); err != nil {
		a.sendError(w, http.StatusBadRequest, err.Error())
		return
	}
	a.sendJSON(w, http.StatusOK, map[string]string{"message": fmt.Sprintf("Proyek '%s' berhasil dihapus", slug)})
}

// ShareWorkspaceProject endpoint: POST /api/v1/projects/{slug}/share
func (a *API) ShareWorkspaceProject(w http.ResponseWriter, r *http.Request) {
	user := a.CurrentUser(r)
	if user == nil {
		a.sendError(w, http.StatusUnauthorized, "Autentikasi diperlukan")
		return
	}

	slug := r.PathValue("slug")
	var payload struct {
		TargetEmail string `json:"email"`
		AccessLevel string `json:"accessLevel"` // "EDITOR", "VIEWER"
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		a.sendError(w, http.StatusBadRequest, "Payload JSON tidak valid")
		return
	}

	// Cari target user berdasarkan email
	users, _ := a.auth.ListUsers()
	var targetUser *auth.UserResponse
	for _, u := range users {
		if strings.EqualFold(u.Email, payload.TargetEmail) {
			targetUser = &u
			break
		}
	}

	targetID := ""
	targetName := payload.TargetEmail
	if targetUser != nil {
		targetID = targetUser.ID
		targetName = targetUser.Name
	}

	access := payload.AccessLevel
	if access != project.AccessEditor && access != project.AccessViewer {
		access = project.AccessViewer
	}

	updated, err := a.projects.ShareProject(slug, user.ID, user.Role, targetID, targetName, payload.TargetEmail, access)
	if err != nil {
		a.sendError(w, http.StatusBadRequest, err.Error())
		return
	}

	a.sendJSON(w, http.StatusOK, updated)
}

// -------------------------------------------------------------
// LEGACY & CRUD MODULE COMPATIBILITY
// -------------------------------------------------------------

func (a *API) DownloadZip(w http.ResponseWriter, r *http.Request, slug string) {
	w.Header().Set("Content-Type", "application/zip")
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s.zip\"", slug))
	if err := a.builder.CreateZip(slug, w); err != nil {
		a.sendError(w, http.StatusNotFound, err.Error())
	}
}

func (a *API) BuildProject(w http.ResponseWriter, r *http.Request, slug string) {
	if err := a.builder.BuildProject(slug); err != nil {
		a.sendError(w, http.StatusInternalServerError, err.Error())
		return
	}
	a.sendJSON(w, http.StatusOK, map[string]string{
		"message": fmt.Sprintf("Project %s successfully built", slug),
		"status":  "ready",
	})
}

func (a *API) ServeLivePreview(w http.ResponseWriter, r *http.Request, slug string) {
	distDir := a.builder.DistDir(slug)
	if _, err := os.Stat(distDir); os.IsNotExist(err) {
		distDir = filepath.Join(a.cfg.WorkspaceDir, ".local-projects", slug, "dist")
		if _, err := os.Stat(distDir); os.IsNotExist(err) {
			distDir = filepath.Join(a.cfg.WorkspaceDir, ".local-projects", slug)
		}
	}

	prefix := fmt.Sprintf("/%s/live", slug)
	relPath := strings.TrimPrefix(r.URL.Path, prefix)
	relPath = strings.TrimPrefix(relPath, "/")

	targetPath := filepath.Join(distDir, relPath)
	if fi, err := os.Stat(targetPath); err == nil && !fi.IsDir() {
		http.ServeFile(w, r, targetPath)
		return
	}

	indexPath := filepath.Join(distDir, "index.html")
	if _, err := os.Stat(indexPath); err == nil {
		http.ServeFile(w, r, indexPath)
		return
	}

	a.sendError(w, http.StatusNotFound, fmt.Sprintf("Live preview untuk project '%s' belum dibangun.", slug))
}

func (a *API) HandleCRUD(w http.ResponseWriter, r *http.Request, project, module string, id string) {
	switch r.Method {
	case http.MethodGet:
		if id != "" {
			item, err := a.crud.GetByID(project, module, id)
			if err != nil {
				a.sendError(w, http.StatusNotFound, err.Error())
				return
			}
			a.sendJSON(w, http.StatusOK, item)
			return
		}

		q := r.URL.Query()
		page, _ := strconv.Atoi(q.Get("page"))
		pageSize, _ := strconv.Atoi(q.Get("pageSize"))

		res, err := a.crud.List(project, module, crud.QueryParameters{
			Search:   q.Get("q"),
			Page:     page,
			PageSize: pageSize,
			SortKey:  q.Get("sortKey"),
			SortDir:  q.Get("sortDir"),
		})
		if err != nil {
			a.sendError(w, http.StatusInternalServerError, err.Error())
			return
		}
		a.sendJSON(w, http.StatusOK, res)

	case http.MethodPost:
		var record crud.Record
		if err := json.NewDecoder(r.Body).Decode(&record); err != nil {
			a.sendError(w, http.StatusBadRequest, "Invalid JSON body")
			return
		}
		created, err := a.crud.Create(project, module, record)
		if err != nil {
			a.sendError(w, http.StatusInternalServerError, err.Error())
			return
		}
		a.sendJSON(w, http.StatusCreated, created)

	case http.MethodPut, http.MethodPatch:
		if id == "" {
			a.sendError(w, http.StatusBadRequest, "Record ID is required for update")
			return
		}
		var updates crud.Record
		if err := json.NewDecoder(r.Body).Decode(&updates); err != nil {
			a.sendError(w, http.StatusBadRequest, "Invalid JSON body")
			return
		}
		updated, err := a.crud.Update(project, module, id, updates)
		if err != nil {
			a.sendError(w, http.StatusInternalServerError, err.Error())
			return
		}
		a.sendJSON(w, http.StatusOK, updated)

	case http.MethodDelete:
		if id == "" {
			a.sendError(w, http.StatusBadRequest, "Record ID is required for delete")
			return
		}
		if err := a.crud.Delete(project, module, id); err != nil {
			a.sendError(w, http.StatusInternalServerError, err.Error())
			return
		}
		a.sendJSON(w, http.StatusOK, map[string]string{"message": "Record successfully deleted"})

	default:
		a.sendError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}
