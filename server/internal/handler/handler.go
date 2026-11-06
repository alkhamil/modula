package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"modula-server/internal/builder"
	"modula-server/internal/config"
	"modula-server/internal/crud"
)

type API struct {
	cfg     *config.Config
	builder *builder.Manager
	crud    *crud.Engine
}

func NewAPI(cfg *config.Config, b *builder.Manager, c *crud.Engine) *API {
	return &API{
		cfg:     cfg,
		builder: b,
		crud:    c,
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

// ListProjects mengambil seluruh daftar proyek.
func (a *API) ListProjects(w http.ResponseWriter, r *http.Request) {
	list, err := a.builder.List()
	if err != nil {
		a.sendError(w, http.StatusInternalServerError, err.Error())
		return
	}
	a.sendJSON(w, http.StatusOK, list)
}

// CreateProject mendaftarkan proyek baru.
func (a *API) CreateProject(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		Name          string   `json:"name"`
		Slug          string   `json:"slug"`
		Theme         string   `json:"theme"`
		PrimaryColor  string   `json:"primaryColor"`
		SelectedPacks []string `json:"selectedPacks"`
	}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		a.sendError(w, http.StatusBadRequest, "Invalid JSON payload")
		return
	}

	if payload.Name == "" || payload.Slug == "" {
		a.sendError(w, http.StatusBadRequest, "Name and slug are required")
		return
	}

	meta := builder.ProjectMetadata{
		Name:          payload.Name,
		Slug:          payload.Slug,
		Theme:         payload.Theme,
		PrimaryColor:  payload.PrimaryColor,
		SelectedPacks: payload.SelectedPacks,
		CreatedAt:     time.Now(),
		Status:        "ready",
	}

	if err := a.builder.Save(meta); err != nil {
		a.sendError(w, http.StatusInternalServerError, err.Error())
		return
	}

	a.sendJSON(w, http.StatusCreated, meta)
}

// DownloadZip mengompres direktori proyek menjadi .zip untuk diunduh.
func (a *API) DownloadZip(w http.ResponseWriter, r *http.Request, slug string) {
	w.Header().Set("Content-Type", "application/zip")
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s.zip\"", slug))
	if err := a.builder.CreateZip(slug, w); err != nil {
		a.sendError(w, http.StatusNotFound, err.Error())
	}
}

// BuildProject memicu proses npm build untuk proyek tertentu.
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

// ServeLivePreview menyajikan aplikasi live preview dengan routing SPA bawaan.
func (a *API) ServeLivePreview(w http.ResponseWriter, r *http.Request, slug string) {
	// Coba cari dari dist direktori proyek di server
	distDir := a.builder.DistDir(slug)
	if _, err := os.Stat(distDir); os.IsNotExist(err) {
		// Fallback jika belum di-build: periksa folder .local-projects di workspace
		distDir = filepath.Join(a.cfg.WorkspaceDir, ".local-projects", slug, "dist")
		if _, err := os.Stat(distDir); os.IsNotExist(err) {
			// Jika masih belum ada dist, periksa root direktori proyek langsung
			distDir = filepath.Join(a.cfg.WorkspaceDir, ".local-projects", slug)
		}
	}

	// Prefix yang di-strip: /:slug/live/
	prefix := fmt.Sprintf("/%s/live", slug)
	relPath := strings.TrimPrefix(r.URL.Path, prefix)
	relPath = strings.TrimPrefix(relPath, "/")

	targetPath := filepath.Join(distDir, relPath)

	// Jika file ada secara fisik (mis. assets/app.js, styles.css, favicon.png)
	if fi, err := os.Stat(targetPath); err == nil && !fi.IsDir() {
		http.ServeFile(w, r, targetPath)
		return
	}

	// Jika tidak ada atau merupakan route halaman (SPA), layani index.html
	indexPath := filepath.Join(distDir, "index.html")
	if _, err := os.Stat(indexPath); err == nil {
		http.ServeFile(w, r, indexPath)
		return
	}

	a.sendError(w, http.StatusNotFound, fmt.Sprintf("Live preview untuk project '%s' belum dibangun atau belum dijalankan di server.", slug))
}

// HandleCRUD routing untuk Dynamic CRUD Module Engine.
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
