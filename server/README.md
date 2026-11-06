# Modula Backend Server (Go)

Backend server berbasis Golang untuk platform Modula. Dirancang ringan, cepat, hemat memori, dan siap dideploy ke VPS menggunakan Docker atau binary langsung.

---

## Fitur Utama

1. **Live Preview Serving (SPA)**:
   - Menyajikan hasil build frontend (`dist/`) proyek per `/:slug/live/` dengan dukungan fallback SPA (`index.html`).
2. **Headless Dynamic CRUD Engine**:
   - Endpoint generic JSON CRUD untuk modul bisnis apapun tanpa perlu restart server:
     - `GET /api/v1/:project/:module` (dengan pagination `?page=1&pageSize=10`, sorting `?sortKey=name&sortDir=asc`, & search `?q=query`)
     - `POST /api/v1/:project/:module`
     - `GET /api/v1/:project/:module/:id`
     - `PUT /api/v1/:project/:module/:id`
     - `DELETE /api/v1/:project/:module/:id`
3. **Project Builder & Packager**:
   - Menjalankan build Vite/npm untuk proyek baru (`POST /api/projects/:slug/build`).
   - Menyediakan unduhan archive `.zip` siap pakai (`GET /api/projects/:slug/download`).
4. **Persistensi Data Ringan**:
   - Menyimpan seluruh data dan state proyek ke direktori `data/` (dapat dimount sebagai volume Docker).

---

## Menjalankan di Lokal (Development)

Pastikan Go 1.22+ terpasang:

```bash
cd server
go run cmd/api/main.go
```

Server akan aktif di `http://localhost:8080`.

Cek status:
```bash
curl http://localhost:8080/health
```

---

## Deploy ke VPS

### Opsi 1: Menggunakan Docker Compose (Direkomendasikan)

1. Salin folder `server/` ke VPS (mis. via `scp`, `rsync`, atau git clone).
2. Jalankan:
   ```bash
   cd server
   docker compose up -d --build
   ```
3. Cek log server:
   ```bash
   docker compose logs -f
   ```

### Opsi 2: Build Binary Langsung di VPS

```bash
cd server
go build -o modula-server ./cmd/api
PORT=8080 DATA_DIR=./data ./modula-server
```

Bisa dijalankan sebagai systemd service (`/etc/systemd/system/modula.service`).

---

## Konfigurasi Environment Variables

| Variable | Default | Keterangan |
| :--- | :--- | :--- |
| `PORT` | `8080` | Port listen server |
| `DATA_DIR` | `./data` | Lokasi folder penyimpanan database JSON |
| `WORKSPACE_DIR` | Parent folder | Root direktori proyek Modula |
| `BASE_DOMAIN` | `localhost:8080` | Domain/IP VPS untuk URL live preview |
| `CORS_ORIGINS` | `*` | Origin yang diizinkan untuk CORS |
