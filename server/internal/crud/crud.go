package crud

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"sync"
	"time"
)

// Record adalah entri data dinamis generic untuk modul bisnis apa pun.
type Record map[string]interface{}

// Engine mengelola penyimpanan data dinamis per proyek dan per modul.
type Engine struct {
	mu      sync.RWMutex
	dataDir string
}

func NewEngine(dataDir string) *Engine {
	recordsDir := filepath.Join(dataDir, "records")
	_ = os.MkdirAll(recordsDir, 0755)
	return &Engine{dataDir: recordsDir}
}

func (e *Engine) modulePath(project, module string) string {
	projDir := filepath.Join(e.dataDir, project)
	_ = os.MkdirAll(projDir, 0755)
	return filepath.Join(projDir, fmt.Sprintf("%s.json", module))
}

func (e *Engine) readRecords(project, module string) ([]Record, error) {
	path := e.modulePath(project, module)
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return []Record{}, nil
	}

	bytes, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var list []Record
	if err := json.Unmarshal(bytes, &list); err != nil {
		return []Record{}, nil
	}
	return list, nil
}

func (e *Engine) writeRecords(project, module string, records []Record) error {
	path := e.modulePath(project, module)
	bytes, err := json.MarshalIndent(records, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(path, bytes, 0644)
}

func randomID(prefix string) string {
	b := make([]byte, 6)
	_, _ = rand.Read(b)
	return fmt.Sprintf("%s-%s", prefix, hex.EncodeToString(b))
}

// ListResponse membungkus hasil pencarian terpaginasi.
type ListResponse struct {
	Data       []Record `json:"data"`
	Total      int      `json:"total"`
	Page       int      `json:"page"`
	PageSize   int      `json:"pageSize"`
	TotalPages int      `json:"totalPages"`
}

// QueryParameters mendefinisikan filter query pencarian data.
type QueryParameters struct {
	Search   string
	Page     int
	PageSize int
	SortKey  string
	SortDir  string
}

// List mengambil daftar record dengan filter, sort, dan pagination.
func (e *Engine) List(project, module string, params QueryParameters) (*ListResponse, error) {
	e.mu.RLock()
	defer e.mu.RUnlock()

	all, err := e.readRecords(project, module)
	if err != nil {
		return nil, err
	}

	// Filter pencarian
	var filtered []Record
	search := strings.ToLower(strings.TrimSpace(params.Search))
	for _, item := range all {
		if search == "" {
			filtered = append(filtered, item)
			continue
		}
		match := false
		for _, v := range item {
			strVal := fmt.Sprintf("%v", v)
			if strings.Contains(strings.ToLower(strVal), search) {
				match = true
				break
			}
		}
		if match {
			filtered = append(filtered, item)
		}
	}

	// Sorting
	if params.SortKey != "" {
		sort.Slice(filtered, func(i, j int) bool {
			valI := fmt.Sprintf("%v", filtered[i][params.SortKey])
			valJ := fmt.Sprintf("%v", filtered[j][params.SortKey])
			if strings.ToLower(params.SortDir) == "desc" {
				return valI > valJ
			}
			return valI < valJ
		})
	}

	total := len(filtered)
	page := params.Page
	if page < 1 {
		page = 1
	}
	pageSize := params.PageSize
	if pageSize < 1 {
		pageSize = 10
	}

	start := (page - 1) * pageSize
	end := start + pageSize
	if start > total {
		start = total
	}
	if end > total {
		end = total
	}

	totalPages := (total + pageSize - 1) / pageSize
	if totalPages == 0 {
		totalPages = 1
	}

	return &ListResponse{
		Data:       filtered[start:end],
		Total:      total,
		Page:       page,
		PageSize:   pageSize,
		TotalPages: totalPages,
	}, nil
}

// GetByID mengambil satu record berdasarkan ID.
func (e *Engine) GetByID(project, module, id string) (Record, error) {
	e.mu.RLock()
	defer e.mu.RUnlock()

	all, err := e.readRecords(project, module)
	if err != nil {
		return nil, err
	}

	for _, item := range all {
		if fmt.Sprintf("%v", item["id"]) == id {
			return item, nil
		}
	}
	return nil, fmt.Errorf("record dengan ID %s tidak ditemukan", id)
}

// Create menambahkan record baru dengan ID unik dan timestamp.
func (e *Engine) Create(project, module string, data Record) (Record, error) {
	e.mu.Lock()
	defer e.mu.Unlock()

	all, err := e.readRecords(project, module)
	if err != nil {
		return nil, err
	}

	if _, ok := data["id"]; !ok || data["id"] == "" {
		data["id"] = randomID(module)
	}
	data["createdAt"] = time.Now().Format(time.RFC3339)
	data["updatedAt"] = time.Now().Format(time.RFC3339)

	all = append([]Record{data}, all...)
	if err := e.writeRecords(project, module, all); err != nil {
		return nil, err
	}
	return data, nil
}

// Update memperbarui data record yang sudah ada.
func (e *Engine) Update(project, module, id string, updates Record) (Record, error) {
	e.mu.Lock()
	defer e.mu.Unlock()

	all, err := e.readRecords(project, module)
	if err != nil {
		return nil, err
	}

	var found bool
	var updated Record
	for i, item := range all {
		if fmt.Sprintf("%v", item["id"]) == id {
			for k, v := range updates {
				if k != "id" && k != "createdAt" {
					item[k] = v
				}
			}
			item["updatedAt"] = time.Now().Format(time.RFC3339)
			all[i] = item
			updated = item
			found = true
			break
		}
	}

	if !found {
		return nil, fmt.Errorf("record %s tidak ditemukan", id)
	}

	if err := e.writeRecords(project, module, all); err != nil {
		return nil, err
	}
	return updated, nil
}

// Delete menghapus record berdasarkan ID.
func (e *Engine) Delete(project, module, id string) error {
	e.mu.Lock()
	defer e.mu.Unlock()

	all, err := e.readRecords(project, module)
	if err != nil {
		return err
	}

	var filtered []Record
	var found bool
	for _, item := range all {
		if fmt.Sprintf("%v", item["id"]) == id {
			found = true
			continue
		}
		filtered = append(filtered, item)
	}

	if !found {
		return fmt.Errorf("record %s tidak ditemukan", id)
	}

	return e.writeRecords(project, module, filtered)
}
