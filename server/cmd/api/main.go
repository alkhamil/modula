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

	"modula-server/internal/auth"
	"modula-server/internal/builder"
	"modula-server/internal/config"
	"modula-server/internal/crud"
	"modula-server/internal/handler"
	"modula-server/internal/project"
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
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, x-auth-token")
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
		if !strings.Contains(r.URL.Path, "/assets/") {
			log.Printf("[%s] %s %s (%v)", r.Method, r.URL.Path, r.RemoteAddr, time.Since(start))
		}
	})
}

func main() {
	cfg := config.Load()

	log.Printf("=========================================")
	log.Printf(" Modula Go Server Starting (Phase 1)...")
	log.Printf(" Port:         %s", cfg.Port)
	log.Printf(" Data Dir:     %s", cfg.DataDir)
	log.Printf(" Workspace:    %s", cfg.WorkspaceDir)
	log.Printf(" Base Domain:  %s", cfg.BaseDomain)
	log.Printf("=========================================")

	builderMgr := builder.NewManager(cfg.DataDir, cfg.WorkspaceDir)
	crudEngine := crud.NewEngine(cfg.DataDir)
	authMgr := auth.NewManager(cfg.DataDir)
	projectMgr := project.NewManager(cfg.DataDir)
	api := handler.NewAPI(cfg, builderMgr, crudEngine, authMgr, projectMgr)

	mux := http.NewServeMux()

	// 1. Health check & status
	mux.HandleFunc("GET /health", api.HealthCheck)
	mux.HandleFunc("GET /{$}", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, `{"service":"modula-backend-go","version":"2.0","status":"running","health":"/health"}`)
	})

	// 2. Auth Endpoints: /api/v1/auth/*
	mux.HandleFunc("POST /api/v1/auth/login", api.Login)
	mux.HandleFunc("POST /api/v1/auth/logout", api.Logout)
	mux.HandleFunc("GET /api/v1/auth/me", api.WithAuth(api.Me))

	// 3. User Management Endpoints: /api/v1/users/* (Khusus Admin / Super Admin)
	mux.HandleFunc("GET /api/v1/users", api.WithAuth(api.ListUsers))
	mux.HandleFunc("POST /api/v1/users", api.WithAuth(api.CreateUser))
	mux.HandleFunc("PUT /api/v1/users/{id}", api.WithAuth(api.UpdateUser))

	// 4. Project Workspace Endpoints: /api/v1/projects/*
	mux.HandleFunc("GET /api/v1/projects", api.WithAuth(api.ListWorkspaceProjects))
	mux.HandleFunc("POST /api/v1/projects", api.WithAuth(api.CreateWorkspaceProject))
	mux.HandleFunc("GET /api/v1/projects/{slug}", api.WithAuth(api.GetWorkspaceProject))
	mux.HandleFunc("PUT /api/v1/projects/{slug}", api.WithAuth(api.UpdateWorkspaceProject))
	mux.HandleFunc("DELETE /api/v1/projects/{slug}", api.WithAuth(api.DeleteWorkspaceProject))
	mux.HandleFunc("POST /api/v1/projects/{slug}/share", api.WithAuth(api.ShareWorkspaceProject))

	// Legacy & compatibility aliases
	mux.HandleFunc("GET /api/projects", api.ListWorkspaceProjects)
	mux.HandleFunc("POST /api/projects", api.CreateWorkspaceProject)
	mux.HandleFunc("GET /api/projects/{slug}", api.GetWorkspaceProject)
	mux.HandleFunc("POST /api/projects/{slug}/build", func(w http.ResponseWriter, r *http.Request) {
		slug := r.PathValue("slug")
		api.BuildProject(w, r, slug)
	})
	mux.HandleFunc("GET /api/projects/{slug}/download", func(w http.ResponseWriter, r *http.Request) {
		slug := r.PathValue("slug")
		api.DownloadZip(w, r, slug)
	})

	// 5. Dynamic Headless CRUD Engine API: /api/v1/data/{project}/{module}
	for _, m := range []string{"GET", "POST", "PUT", "DELETE", "PATCH"} {
		method := m
		mux.HandleFunc(method+" /api/v1/data/{project}/{module}/{id}", func(w http.ResponseWriter, r *http.Request) {
			project := r.PathValue("project")
			module := r.PathValue("module")
			id := r.PathValue("id")
			api.HandleCRUD(w, r, project, module, id)
		})
		mux.HandleFunc(method+" /api/v1/data/{project}/{module}", func(w http.ResponseWriter, r *http.Request) {
			project := r.PathValue("project")
			module := r.PathValue("module")
			api.HandleCRUD(w, r, project, module, "")
		})
	}

	// 6. Live Preview Static Dist Handler
	mux.HandleFunc("GET /{slug}/live", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, r.URL.Path+"/", http.StatusMovedPermanently)
	})
	mux.HandleFunc("GET /{slug}/live/", func(w http.ResponseWriter, r *http.Request) {
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
		log.Printf("Server listening on port %s", cfg.Port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server error: %v", err)
		}
	}()

	<-stop
	log.Println("Shutting down server gracefully...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Printf("Server forced to shutdown: %v", err)
	}

	log.Println("Server gracefully stopped.")
}
