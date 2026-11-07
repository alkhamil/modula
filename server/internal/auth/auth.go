package auth

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"
)

// Daftar Role Resmi Sesuai Spec Modula 2.0 (Section 5.2)
const (
	RoleSuperAdmin = "SUPER_ADMIN"
	RoleAdmin      = "ADMIN"
	RolePresales   = "PRESALES"
	RoleBPA        = "BPA"
	RoleUIUX       = "UI_UX"
	RoleDeveloper  = "DEVELOPER"
	RoleQA         = "QA"
)

// RolePermissions mendefinisikan granular permission bundle per peran.
var RolePermissions = map[string][]string{
	RoleSuperAdmin: {"*"},
	RoleAdmin: {
		"users.view", "users.create", "users.edit", "users.manage",
		"projects.view", "projects.create", "projects.edit", "projects.delete", "projects.share",
		"builder.view", "builder.edit", "export.all",
	},
	RolePresales: {
		"projects.view", "projects.create", "projects.edit",
		"builder.view", "builder.edit", "prototype.view", "prototype.present",
	},
	RoleBPA: {
		"projects.view", "projects.create", "projects.edit",
		"builder.view", "builder.edit", "prototype.view", "prototype.present", "contract.view",
	},
	RoleUIUX: {
		"projects.view", "projects.edit",
		"components.view", "components.edit", "design_system.view", "builder.view", "builder.edit",
	},
	RoleDeveloper: {
		"projects.view", "builder.view", "export.code", "export.contract", "contract.view",
	},
	RoleQA: {
		"projects.view", "builder.view", "prototype.view", "qa.scenarios", "qa.export",
	},
}

// User menyimpan kredensial dan metadata akun internal.
type User struct {
	ID           string     `json:"id"`
	Name         string     `json:"name"`
	Email        string     `json:"email"`
	PasswordHash string     `json:"passwordHash"`
	Salt         string     `json:"salt"`
	Role         string     `json:"role"`
	Status       string     `json:"status"` // "ACTIVE", "INACTIVE"
	CreatedAt    time.Time  `json:"createdAt"`
	LastLogin    *time.Time `json:"lastLogin,omitempty"`
}

// UserResponse adalah representasi aman akun tanpa data sensitif hash/salt.
type UserResponse struct {
	ID          string     `json:"id"`
	Name        string     `json:"name"`
	Email       string     `json:"email"`
	Role        string     `json:"role"`
	Status      string     `json:"status"`
	Permissions []string   `json:"permissions"`
	CreatedAt   time.Time  `json:"createdAt"`
	LastLogin   *time.Time `json:"lastLogin,omitempty"`
}

type Session struct {
	Token     string    `json:"token"`
	UserID    string    `json:"userId"`
	CreatedAt time.Time `json:"createdAt"`
	ExpiresAt time.Time `json:"expiresAt"`
}

type Manager struct {
	mu       sync.RWMutex
	dataDir  string
	sessions map[string]Session // token -> session
}

func NewManager(dataDir string) *Manager {
	_ = os.MkdirAll(dataDir, 0755)
	m := &Manager{
		dataDir:  dataDir,
		sessions: make(map[string]Session),
	}
	m.ensureSeedUsers()
	return m
}

func (m *Manager) usersFile() string {
	return filepath.Join(m.dataDir, "users.json")
}

func hashPassword(password, salt string) string {
	h := sha256.New()
	h.Write([]byte(password + ":" + salt + ":modula_secure_salt_v2"))
	return hex.EncodeToString(h.Sum(nil))
}

func generateRandomHex(n int) string {
	bytes := make([]byte, n)
	_, _ = rand.Read(bytes)
	return hex.EncodeToString(bytes)
}

func (u *User) ToResponse() UserResponse {
	perms, ok := RolePermissions[u.Role]
	if !ok {
		perms = []string{"projects.view"}
	}
	return UserResponse{
		ID:          u.ID,
		Name:        u.Name,
		Email:       u.Email,
		Role:        u.Role,
		Status:      u.Status,
		Permissions: perms,
		CreatedAt:   u.CreatedAt,
		LastLogin:   u.LastLogin,
	}
}

func (m *Manager) ensureSeedUsers() {
	m.mu.Lock()
	defer m.mu.Unlock()

	users, err := m.loadUsersUnlocked()
	if err == nil && len(users) > 0 {
		return
	}

	now := time.Now().UTC()
	defaultPass := "modula123"

	seeds := []struct {
		id    string
		name  string
		email string
		role  string
	}{
		{"usr-superadmin", "Super Administrator", "superadmin@modula.io", RoleSuperAdmin},
		{"usr-admin", "Administrator", "admin@modula.io", RoleAdmin},
		{"usr-presales", "Presales Consultant", "presales@modula.io", RolePresales},
		{"usr-bpa", "Business Process Analyst", "bpa@modula.io", RoleBPA},
		{"usr-uiux", "UI/UX Specialist", "uiux@modula.io", RoleUIUX},
		{"usr-developer", "Frontend Developer", "developer@modula.io", RoleDeveloper},
		{"usr-qa", "Quality Assurance", "qa@modula.io", RoleQA},
	}

	var newUsers []User
	for _, s := range seeds {
		salt := generateRandomHex(8)
		newUsers = append(newUsers, User{
			ID:           s.id,
			Name:         s.name,
			Email:        s.email,
			PasswordHash: hashPassword(defaultPass, salt),
			Salt:         salt,
			Role:         s.role,
			Status:       "ACTIVE",
			CreatedAt:    now,
		})
	}

	_ = m.saveUsersUnlocked(newUsers)
}

func (m *Manager) loadUsersUnlocked() ([]User, error) {
	path := m.usersFile()
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return []User{}, nil
	}
	bytes, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	var users []User
	if err := json.Unmarshal(bytes, &users); err != nil {
		return []User{}, nil
	}
	return users, nil
}

func (m *Manager) saveUsersUnlocked(users []User) error {
	bytes, err := json.MarshalIndent(users, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(m.usersFile(), bytes, 0644)
}

// Login memverifikasi email dan password, serta membuat sesi aktif (24 jam).
func (m *Manager) Login(email, password string) (*UserResponse, string, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	users, err := m.loadUsersUnlocked()
	if err != nil {
		return nil, "", errors.New("gagal membaca data pengguna")
	}

	normalizedEmail := strings.TrimSpace(strings.ToLower(email))
	var target *User
	var targetIdx int
	for i, u := range users {
		if strings.ToLower(u.Email) == normalizedEmail {
			target = &users[i]
			targetIdx = i
			break
		}
	}

	if target == nil {
		return nil, "", errors.New("email atau kata sandi tidak valid")
	}

	if target.Status != "ACTIVE" {
		return nil, "", errors.New("akun ini dinonaktifkan. Hubungi Administrator")
	}

	computedHash := hashPassword(password, target.Salt)
	if computedHash != target.PasswordHash {
		return nil, "", errors.New("email atau kata sandi tidak valid")
	}

	// Update waktu login terakhir
	now := time.Now().UTC()
	target.LastLogin = &now
	users[targetIdx] = *target
	_ = m.saveUsersUnlocked(users)

	// Buat sesi
	token := generateRandomHex(32)
	m.sessions[token] = Session{
		Token:     token,
		UserID:    target.ID,
		CreatedAt: now,
		ExpiresAt: now.Add(24 * time.Hour),
	}

	resp := target.ToResponse()
	return &resp, token, nil
}

// Logout menghapus token sesi aktif.
func (m *Manager) Logout(token string) {
	m.mu.Lock()
	defer m.mu.Unlock()
	delete(m.sessions, token)
}

// ValidateToken memvalidasi token sesi dan mengembalikan profil pengguna.
func (m *Manager) ValidateToken(token string) (*UserResponse, error) {
	m.mu.RLock()
	session, exists := m.sessions[token]
	m.mu.RUnlock()

	if !exists || time.Now().UTC().After(session.ExpiresAt) {
		return nil, errors.New("sesi tidak valid atau telah kedaluwarsa")
	}

	m.mu.RLock()
	defer m.mu.RUnlock()

	users, err := m.loadUsersUnlocked()
	if err != nil {
		return nil, errors.New("gagal memuat data pengguna")
	}

	for _, u := range users {
		if u.ID == session.UserID {
			if u.Status != "ACTIVE" {
				return nil, errors.New("akun tidak aktif")
			}
			resp := u.ToResponse()
			return &resp, nil
		}
	}

	return nil, errors.New("pengguna tidak ditemukan")
}

// ListUsers mengambil seluruh daftar akun internal.
func (m *Manager) ListUsers() ([]UserResponse, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	users, err := m.loadUsersUnlocked()
	if err != nil {
		return nil, err
	}

	res := make([]UserResponse, len(users))
	for i, u := range users {
		res[i] = u.ToResponse()
	}
	return res, nil
}

// CreateUser mendaftarkan akun internal baru (hanya Admin/Super Admin).
func (m *Manager) CreateUser(name, email, password, role string) (*UserResponse, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	name = strings.TrimSpace(name)
	email = strings.TrimSpace(strings.ToLower(email))
	if name == "" || email == "" || password == "" {
		return nil, errors.New("nama, email, dan kata sandi wajib diisi")
	}

	if _, validRole := RolePermissions[role]; !validRole {
		return nil, fmt.Errorf("role tidak valid: %s", role)
	}

	users, err := m.loadUsersUnlocked()
	if err != nil {
		return nil, err
	}

	for _, u := range users {
		if strings.ToLower(u.Email) == email {
			return nil, errors.New("email sudah terdaftar dalam sistem")
		}
	}

	salt := generateRandomHex(8)
	newUser := User{
		ID:           fmt.Sprintf("usr-%d", time.Now().UnixNano()),
		Name:         name,
		Email:        email,
		PasswordHash: hashPassword(password, salt),
		Salt:         salt,
		Role:         role,
		Status:       "ACTIVE",
		CreatedAt:    time.Now().UTC(),
	}

	users = append(users, newUser)
	if err := m.saveUsersUnlocked(users); err != nil {
		return nil, err
	}

	resp := newUser.ToResponse()
	return &resp, nil
}

// UpdateUser memperbarui nama, role, atau status pengguna.
func (m *Manager) UpdateUser(id, name, role, status string) (*UserResponse, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	users, err := m.loadUsersUnlocked()
	if err != nil {
		return nil, err
	}

	var found *User
	var foundIdx int
	for i, u := range users {
		if u.ID == id {
			found = &users[i]
			foundIdx = i
			break
		}
	}

	if found == nil {
		return nil, errors.New("pengguna tidak ditemukan")
	}

	if name != "" {
		found.Name = strings.TrimSpace(name)
	}
	if role != "" {
		if _, valid := RolePermissions[role]; valid {
			found.Role = role
		}
	}
	if status == "ACTIVE" || status == "INACTIVE" {
		found.Status = status
	}

	users[foundIdx] = *found
	if err := m.saveUsersUnlocked(users); err != nil {
		return nil, err
	}

	resp := found.ToResponse()
	return &resp, nil
}
