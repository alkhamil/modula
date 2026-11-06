package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"modula-server/internal/builder"
	"modula-server/internal/config"
	"modula-server/internal/crud"
	"modula-server/internal/handler"
)

// withCORS middleware mengizinkan cross-origin requests untuk integrasi frontend dan VPS.
func withCORS(next http.Handler, allowedOrigins []string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		allowed := "*"
		if len(allowedOrigins) > 0 && origin != "" {
			for _, o := range allowedOrigins {
				if o == "*" || o == origin {
					allowed = origin
					break
				}
			}
		}

		w.Header().Set("Access-Control-Allow-Origin", allowed)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// withLogging middleware mencatat akses HTTP.
func withLogging(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next.ServeHTTP(w, r)
		// Tidak log file aset static agar tidak membanjiri log
		if !strings.Contains(r.URL.Path, "/assets/") {
			log.Printf("[%s] %s %s (%v)", r.Method, r.URL.Path, r.RemoteAddr, time.Since(start))
		}
	})
}

func main() {
	cfg := config.Load()

	log.Printf("=========================================")
	log.Printf(" Modula Go Server Starting...")
	log.Printf(" Port:         %s", cfg.Port)
	log.Printf(" Data Dir:     %s", cfg.DataDir)
	log.Printf(" Workspace:    %s", cfg.WorkspaceDir)
	log.Printf(" Base Domain:  %s", cfg.BaseDomain)
	log.Printf("=========================================")

	builderMgr := builder.NewManager(cfg.DataDir, cfg.WorkspaceDir)
	crudEngine := crud.NewEngine(cfg.DataDir)
	api := handler.NewAPI(cfg, builderMgr, crudEngine)

	mux := http.NewServeMux()

	// 1. Health check & status
	mux.HandleFunc("GET /health", api.HealthCheck)
	mux.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, `{"service":"modula-backend-go","status":"running","health":"/health","api":"/api/projects"}`)
	})

	// 2. Project Management API
	mux.HandleFunc("GET /api/projects", api.ListProjects)
	mux.HandleFunc("POST /api/projects", api.CreateProject)
	mux.HandleFunc("POST /api/projects/{slug}/build", func(w http.ResponseWriter, r *http.Request) {
		slug := r.PathValue("slug")
		api.BuildProject(w, r, slug)
	})
	mux.HandleFunc("GET /api/projects/{slug}/download", func(w http.ResponseWriter, r *http.Request) {
		slug := r.PathValue("slug")
		api.DownloadZip(w, r, slug)
	})

	// 3. Dynamic Headless CRUD Engine API
	// Mengelola entri data per project dan per modul: /api/v1/{project}/{module}
	mux.HandleFunc("/api/v1/{project}/{module}/{id}", func(w http.ResponseWriter, r *http.Request) {
		project := r.PathValue("project")
		module := r.PathValue("module")
		id := r.PathValue("id")
		api.HandleCRUD(w, r, project, module, id)
	})
	mux.HandleFunc("/api/v1/{project}/{module}", func(w http.ResponseWriter, r *http.Request) {
		project := r.PathValue("project")
		module := r.PathValue("module")
		api.HandleCRUD(w, r, project, module, "")
	})

	// 4. Live Preview SPA Handler
	// Menyajikan static SPA dist yang telah dibuild: /{slug}/live/
	mux.HandleFunc("/{slug}/live", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, r.URL.Path+"/", http.StatusMovedPermanently)
	})
	mux.HandleFunc("/{slug}/live/", func(w http.ResponseWriter, r *http.Request) {
		slug := r.PathValue("slug")
		api.ServeLivePreview(w, r, slug)
	})

	// Wrap middleware
	handlerWithMiddleware := withLogging(withCORS(mux, cfg.CORSOrigins))

	server := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      handlerWithMiddleware,
		ReadTimeout:  30 * time.Second,
		WriteTimeout: 60 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	// Channel sinyal shutdown
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)

	go func() {
		log.Printf("Server listening on :%s", cfg.Port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server startup failed: %v", err)
		}
	}()

	<-stop
	log.Println("Shutting down server gracefully...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Printf("Server forced shutdown error: %v", err)
	}

	log.Println("Modula server exited cleanly.")
}
