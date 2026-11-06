# Multi-stage Dockerfile:
# Stage 1: Build the Go backend binary
FROM golang:1.23-alpine AS go-builder
WORKDIR /build

COPY go.mod ./
# Jika ada go.sum: COPY go.sum ./
RUN go mod download || true

COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o modula-server ./cmd/api

# Stage 2: Runtime image containing Node.js 22 for npm/vite build tasks + Go binary
FROM node:22-alpine AS runner
WORKDIR /app

# Install standard utilities needed for builds
RUN apk add --no-cache bash git ca-certificates tzdata

# Copy binary dari stage 1
COPY --from=go-builder /build/modula-server /app/modula-server

# Buat folder data persisten
RUN mkdir -p /app/data

ENV PORT=8080
ENV DATA_DIR=/app/data
ENV CORS_ORIGINS="*"

EXPOSE 8080

CMD ["/app/modula-server"]
