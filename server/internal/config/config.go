package config

import (
	"os"
	"path/filepath"
	"strings"
)

// Config menyimpan seluruh konfigurasi runtime backend Modula.
type Config struct {
	Port         string
	DataDir      string
	WorkspaceDir string
	BaseDomain   string
	CORSOrigins  []string
}

// Load memuat konfigurasi dari environment variables atau fallback default.
func Load() *Config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	dataDir := os.Getenv("DATA_DIR")
	if dataDir == "" {
		dataDir = "./data"
	}

	workspaceDir := os.Getenv("WORKSPACE_DIR")
	if workspaceDir == "" {
		// Default ke parent directory jika dijalankan dari dalam server/
		if cwd, err := os.Getwd(); err == nil {
			if filepath.Base(cwd) == "server" {
				workspaceDir = filepath.Dir(cwd)
			} else {
				workspaceDir = cwd
			}
		}
	}

	baseDomain := os.Getenv("BASE_DOMAIN")
	if baseDomain == "" {
		baseDomain = "localhost:8080"
	}

	corsRaw := os.Getenv("CORS_ORIGINS")
	var corsOrigins []string
	if corsRaw != "" {
		for _, o := range strings.Split(corsRaw, ",") {
			trimmed := strings.TrimSpace(o)
			if trimmed != "" {
				corsOrigins = append(corsOrigins, trimmed)
			}
		}
	} else {
		corsOrigins = []string{"*"}
	}

	_ = os.MkdirAll(dataDir, 0755)

	return &Config{
		Port:         port,
		DataDir:      dataDir,
		WorkspaceDir: workspaceDir,
		BaseDomain:   baseDomain,
		CORSOrigins:  corsOrigins,
	}
}
