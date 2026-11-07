package project

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"
)

const (
	AccessOwner  = "OWNER"
	AccessEditor = "EDITOR"
	AccessViewer = "VIEWER"
)

type Member struct {
	UserID      string    `json:"userId"`
	Name        string    `json:"name"`
	Email       string    `json:"email"`
	AccessLevel string    `json:"accessLevel"` // "OWNER", "EDITOR", "VIEWER"
	AddedAt     time.Time `json:"addedAt"`
}

type Project struct {
	ID            string    `json:"id"`
	Name          string    `json:"name"`
	Slug          string    `json:"slug"`
	Description   string    `json:"description"`
	Theme         string    `json:"theme"`
	PrimaryColor  string    `json:"primaryColor"`
	LogoURL       string    `json:"logoUrl,omitempty"`
	OwnerID       string    `json:"ownerId"`
	OwnerName     string    `json:"ownerName"`
	OwnerEmail    string    `json:"ownerEmail"`
	Members       []Member  `json:"members"`
	SelectedPacks []string  `json:"selectedPacks"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
	Status        string    `json:"status"` // "ready", "archived"
}

type Manager struct {
	mu      sync.RWMutex
	dataDir string
}

func NewManager(dataDir string) *Manager {
	_ = os.MkdirAll(dataDir, 0755)
	m := &Manager{dataDir: dataDir}
	m.ensureSeedProjects()
	return m
}

func (m *Manager) projectsFile() string {
	return filepath.Join(m.dataDir, "projects.json")
}

func (m *Manager) ensureSeedProjects() {
	m.mu.Lock()
	defer m.mu.Unlock()

	projects, err := m.loadUnlocked()
	if err == nil && len(projects) > 0 {
		return
	}

	now := time.Now().UTC()
	seeds := []Project{
		{
			ID:           "prj-enterprise-portal",
			Name:         "Enterprise Portal",
			Slug:         "enterprise-portal",
			Description:  "Portal utama manajemen data master perusahaan, pengguna, dan hak akses staf operasional.",
			Theme:        "light",
			PrimaryColor: "#00487a",
			OwnerID:      "usr-superadmin",
			OwnerName:    "Super Administrator",
			OwnerEmail:   "superadmin@modula.io",
			Members: []Member{
				{UserID: "usr-bpa", Name: "Business Process Analyst", Email: "bpa@modula.io", AccessLevel: AccessEditor, AddedAt: now},
				{UserID: "usr-developer", Name: "Frontend Developer", Email: "developer@modula.io", AccessLevel: AccessViewer, AddedAt: now},
			},
			SelectedPacks: []string{"login", "user", "role", "generator"},
			CreatedAt:     now.Add(-48 * time.Hour),
			UpdatedAt:     now.Add(-2 * time.Hour),
			Status:        "ready",
		},
		{
			ID:           "prj-finance-billing",
			Name:         "Finance & Billing CMS",
			Slug:         "finance-billing",
			Description:  "Aplikasi tagihan berkala, rekonsiliasi pembayaran mitra, dan laporan audit keuangan.",
			Theme:        "light",
			PrimaryColor: "#0f766e",
			OwnerID:      "usr-presales",
			OwnerName:    "Presales Consultant",
			OwnerEmail:   "presales@modula.io",
			Members: []Member{
				{UserID: "usr-superadmin", Name: "Super Administrator", Email: "superadmin@modula.io", AccessLevel: AccessOwner, AddedAt: now},
			},
			SelectedPacks: []string{"login", "user", "role"},
			CreatedAt:     now.Add(-24 * time.Hour),
			UpdatedAt:     now.Add(-5 * time.Hour),
			Status:        "ready",
		},
	}

	_ = m.saveUnlocked(seeds)
}

func (m *Manager) loadUnlocked() ([]Project, error) {
	path := m.projectsFile()
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return []Project{}, nil
	}
	bytes, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	var list []Project
	if err := json.Unmarshal(bytes, &list); err != nil {
		return []Project{}, nil
	}
	return list, nil
}

func (m *Manager) saveUnlocked(list []Project) error {
	bytes, err := json.MarshalIndent(list, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(m.projectsFile(), bytes, 0644)
}

// ListProjects mengambil daftar proyek yang dapat diakses pengguna.
func (m *Manager) ListProjects(userID, userRole string) ([]Project, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	all, err := m.loadUnlocked()
	if err != nil {
		return nil, err
	}

	// Super Admin dan Admin dapat melihat seluruh proyek workspace
	if userRole == "SUPER_ADMIN" || userRole == "ADMIN" {
		return all, nil
	}

	// Pengguna reguler hanya melihat proyek miliknya atau di mana ia menjadi anggota
	var filtered []Project
	for _, p := range all {
		if p.OwnerID == userID {
			filtered = append(filtered, p)
			continue
		}
		for _, mem := range p.Members {
			if mem.UserID == userID {
				filtered = append(filtered, p)
				break
			}
		}
	}
	return filtered, nil
}

// GetProjectBySlug mencari proyek dan mengembalikan access level pengguna terhadap proyek tersebut.
func (m *Manager) GetProjectBySlug(slug, userID, userRole string) (*Project, string, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	all, err := m.loadUnlocked()
	if err != nil {
		return nil, "", err
	}

	for _, p := range all {
		if p.Slug == slug {
			if userRole == "SUPER_ADMIN" || userRole == "ADMIN" || p.OwnerID == userID {
				return &p, AccessOwner, nil
			}
			for _, mem := range p.Members {
				if mem.UserID == userID {
					return &p, mem.AccessLevel, nil
				}
			}
			return nil, "", errors.New("kamu tidak memiliki akses ke proyek ini")
		}
	}

	return nil, "", errors.New("proyek tidak ditemukan")
}

// CreateProject membuat proyek baru dengan owner = pembuat.
func (m *Manager) CreateProject(userID, userName, userEmail string, input Project) (*Project, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	name := strings.TrimSpace(input.Name)
	if name == "" {
		return nil, errors.New("nama proyek wajib diisi")
	}

	slug := strings.TrimSpace(strings.ToLower(input.Slug))
	if slug == "" {
		// generate slug dari nama
		slug = strings.ReplaceAll(name, " ", "-")
	}

	all, err := m.loadUnlocked()
	if err != nil {
		return nil, err
	}

	for _, p := range all {
		if p.Slug == slug {
			return nil, fmt.Errorf("slug '%s' sudah digunakan oleh proyek lain", slug)
		}
	}

	now := time.Now().UTC()
	primaryColor := input.PrimaryColor
	if primaryColor == "" {
		primaryColor = "#00487a"
	}
	theme := input.Theme
	if theme == "" {
		theme = "light"
	}

	newProj := Project{
		ID:            fmt.Sprintf("prj-%d", time.Now().UnixNano()),
		Name:          name,
		Slug:          slug,
		Description:   strings.TrimSpace(input.Description),
		Theme:         theme,
		PrimaryColor:  primaryColor,
		LogoURL:       input.LogoURL,
		OwnerID:       userID,
		OwnerName:     userName,
		OwnerEmail:    userEmail,
		Members:       []Member{},
		SelectedPacks: input.SelectedPacks,
		CreatedAt:     now,
		UpdatedAt:     now,
		Status:        "ready",
	}

	all = append([]Project{newProj}, all...)
	if err := m.saveUnlocked(all); err != nil {
		return nil, err
	}

	return &newProj, nil
}

// UpdateProject memperbarui metadata proyek.
func (m *Manager) UpdateProject(slug, userID, userRole string, updates Project) (*Project, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	all, err := m.loadUnlocked()
	if err != nil {
		return nil, err
	}

	var targetIdx = -1
	for i, p := range all {
		if p.Slug == slug {
			// Periksa permission: Hanya Owner, Editor, atau Admin
			isOwner := p.OwnerID == userID
			isAdmin := userRole == "SUPER_ADMIN" || userRole == "ADMIN"
			isEditor := false
			for _, mem := range p.Members {
				if mem.UserID == userID && (mem.AccessLevel == AccessEditor || mem.AccessLevel == AccessOwner) {
					isEditor = true
					break
				}
			}

			if !isOwner && !isAdmin && !isEditor {
				return nil, errors.New("hanya Owner atau Editor yang dapat mengubah proyek ini")
			}

			targetIdx = i
			break
		}
	}

	if targetIdx == -1 {
		return nil, errors.New("proyek tidak ditemukan")
	}

	p := &all[targetIdx]
	if updates.Name != "" {
		p.Name = strings.TrimSpace(updates.Name)
	}
	if updates.Description != "" {
		p.Description = strings.TrimSpace(updates.Description)
	}
	if updates.Theme != "" {
		p.Theme = updates.Theme
	}
	if updates.PrimaryColor != "" {
		p.PrimaryColor = updates.PrimaryColor
	}
	if updates.LogoURL != "" {
		p.LogoURL = updates.LogoURL
	}
	if len(updates.SelectedPacks) > 0 {
		p.SelectedPacks = updates.SelectedPacks
	}
	p.UpdatedAt = time.Now().UTC()

	all[targetIdx] = *p
	if err := m.saveUnlocked(all); err != nil {
		return nil, err
	}

	return p, nil
}

// DeleteProject menghapus proyek dari workspace (hanya Owner atau Super Admin).
func (m *Manager) DeleteProject(slug, userID, userRole string) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	all, err := m.loadUnlocked()
	if err != nil {
		return err
	}

	var targetIdx = -1
	for i, p := range all {
		if p.Slug == slug {
			if p.OwnerID != userID && userRole != "SUPER_ADMIN" && userRole != "ADMIN" {
				return errors.New("hanya Pemilik proyek atau Administrator yang dapat menghapus proyek ini")
			}
			targetIdx = i
			break
		}
	}

	if targetIdx == -1 {
		return errors.New("proyek tidak ditemukan")
	}

	all = append(all[:targetIdx], all[targetIdx+1:]...)
	return m.saveUnlocked(all)
}

// ShareProject menambahkan atau memperbarui anggota kolaborator pada proyek.
func (m *Manager) ShareProject(slug, userID, userRole, targetUserID, targetName, targetEmail, accessLevel string) (*Project, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	all, err := m.loadUnlocked()
	if err != nil {
		return nil, err
	}

	var targetIdx = -1
	for i, p := range all {
		if p.Slug == slug {
			if p.OwnerID != userID && userRole != "SUPER_ADMIN" && userRole != "ADMIN" {
				return nil, errors.New("hanya Pemilik proyek yang dapat membagikan proyek ini")
			}
			targetIdx = i
			break
		}
	}

	if targetIdx == -1 {
		return nil, errors.New("proyek tidak ditemukan")
	}

	p := &all[targetIdx]
	var updated bool
	for j, mem := range p.Members {
		if mem.UserID == targetUserID || strings.EqualFold(mem.Email, targetEmail) {
			p.Members[j].AccessLevel = accessLevel
			updated = true
			break
		}
	}

	if !updated {
		p.Members = append(p.Members, Member{
			UserID:      targetUserID,
			Name:        targetName,
			Email:       targetEmail,
			AccessLevel: accessLevel,
			AddedAt:     time.Now().UTC(),
		})
	}

	p.UpdatedAt = time.Now().UTC()
	all[targetIdx] = *p
	if err := m.saveUnlocked(all); err != nil {
		return nil, err
	}

	return p, nil
}
