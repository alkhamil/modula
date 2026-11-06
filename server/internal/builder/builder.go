package builder

import (
	"archive/zip"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"sync"
	"time"
)

// ProjectMetadata menyimpan konfigurasi proyek yang terdaftar di server.
type ProjectMetadata struct {
	Name          string    `json:"name"`
	Slug          string    `json:"slug"`
	Theme         string    `json:"theme"`
	PrimaryColor  string    `json:"primaryColor"`
	SelectedPacks []string  `json:"selectedPacks"`
	CreatedAt     time.Time `json:"createdAt"`
	BuiltAt       time.Time `json:"builtAt,omitempty"`
	Status        string    `json:"status"` // "ready", "building", "error"
}

// Manager mengelola pembuatan, penyimpanan, dan build proyek di server.
type Manager struct {
	mu           sync.RWMutex
	dataDir      string
	workspaceDir string
}

func NewManager(dataDir, workspaceDir string) *Manager {
	projectsDir := filepath.Join(dataDir, "projects")
	_ = os.MkdirAll(projectsDir, 0755)
	return &Manager{
		dataDir:      dataDir,
		workspaceDir: workspaceDir,
	}
}

func (m *Manager) projectsFile() string {
	return filepath.Join(m.dataDir, "projects.json")
}

// List mengambil seluruh daftar proyek.
func (m *Manager) List() ([]ProjectMetadata, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	path := m.projectsFile()
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return []ProjectMetadata{}, nil
	}

	bytes, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var list []ProjectMetadata
	if err := json.Unmarshal(bytes, &list); err != nil {
		return []ProjectMetadata{}, nil
	}
	return list, nil
}

// Save menyimpan atau memperbarui metadata proyek.
func (m *Manager) Save(meta ProjectMetadata) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	list, _ := m.loadListUnlocked()
	var updated bool
	for i, item := range list {
		if item.Slug == meta.Slug {
			list[i] = meta
			updated = true
			break
		}
	}
	if !updated {
		list = append([]ProjectMetadata{meta}, list...)
	}

	bytes, err := json.MarshalIndent(list, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(m.projectsFile(), bytes, 0644)
}

func (m *Manager) loadListUnlocked() ([]ProjectMetadata, error) {
	path := m.projectsFile()
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return []ProjectMetadata{}, nil
	}
	bytes, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	var list []ProjectMetadata
	_ = json.Unmarshal(bytes, &list)
	return list, nil
}

// GetBySlug mengambil metadata proyek berdasarkan slug.
func (m *Manager) GetBySlug(slug string) (*ProjectMetadata, error) {
	list, err := m.List()
	if err != nil {
		return nil, err
	}
	for _, p := range list {
		if p.Slug == slug {
			return &p, nil
		}
	}
	return nil, fmt.Errorf("proyek %s tidak ditemukan", slug)
}

// ProjectDir mengembalikan path absolut direktori proyek di disk.
func (m *Manager) ProjectDir(slug string) string {
	return filepath.Join(m.dataDir, "projects", slug)
}

// DistDir mengembalikan path direktori hasil build statis (dist/).
func (m *Manager) DistDir(slug string) string {
	return filepath.Join(m.ProjectDir(slug), "dist")
}

// BuildProject menjalankan build Vite di server untuk proyek tertentu.
func (m *Manager) BuildProject(slug string) error {
	projDir := m.ProjectDir(slug)
	if _, err := os.Stat(filepath.Join(projDir, "package.json")); os.IsNotExist(err) {
		return fmt.Errorf("direktori proyek %s belum siap atau tidak memiliki package.json", slug)
	}

	// npm install jika node_modules belum ada
	if _, err := os.Stat(filepath.Join(projDir, "node_modules")); os.IsNotExist(err) {
		cmdInstall := exec.Command("npm", "install")
		cmdInstall.Dir = projDir
		if out, err := cmdInstall.CombinedOutput(); err != nil {
			return fmt.Errorf("npm install gagal: %s (%v)", string(out), err)
		}
	}

	// npm run build
	cmdBuild := exec.Command("npm", "run", "build")
	cmdBuild.Dir = projDir
	if out, err := cmdBuild.CombinedOutput(); err != nil {
		return fmt.Errorf("npm run build gagal: %s (%v)", string(out), err)
	}

	meta, err := m.GetBySlug(slug)
	if err == nil {
		meta.BuiltAt = time.Now()
		meta.Status = "ready"
		_ = m.Save(*meta)
	}

	return nil
}

// CreateZip mengompres direktori proyek menjadi berkas arsip .zip untuk diunduh.
func (m *Manager) CreateZip(slug string, w io.Writer) error {
	projDir := m.ProjectDir(slug)
	if _, err := os.Stat(projDir); os.IsNotExist(err) {
		return fmt.Errorf("folder proyek %s tidak ditemukan", slug)
	}

	zipWriter := zip.NewWriter(w)
	defer zipWriter.Close()

	return filepath.Walk(projDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		// Jangan sertakan node_modules dan .git ke dalam zip
		rel, err := filepath.Rel(projDir, path)
		if err != nil {
			return err
		}

		if rel == "node_modules" || strings.HasPrefix(rel, "node_modules/") {
			if info.IsDir() {
				return filepath.SkipDir
			}
			return nil
		}
		if rel == ".git" || strings.HasPrefix(rel, ".git/") {
			if info.IsDir() {
				return filepath.SkipDir
			}
			return nil
		}

		if info.IsDir() {
			return nil
		}

		fileHeader, err := zip.FileInfoHeader(info)
		if err != nil {
			return err
		}
		fileHeader.Name = filepath.ToSlash(filepath.Join(slug, rel))
		fileHeader.Method = zip.Deflate

		writer, err := zipWriter.CreateHeader(fileHeader)
		if err != nil {
			return err
		}

		file, err := os.Open(path)
		if err != nil {
			return err
		}
		defer file.Close()

		_, err = io.Copy(writer, file)
		return err
	})
}
