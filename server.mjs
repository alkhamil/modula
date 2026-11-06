/**
 * Production Server untuk Modula dengan runner project terintegrasi.
 *
 * Mendukung:
 * 1. Penyajian file statis Modula SPA (`dist/`) dengan fallback index.html.
 * 2. API `/__api/run-project` dan `/__api/stop-project` untuk menyusun project dari template.
 * 3. Live Project URL pada `domain.com/:slug/live/` yang menjalankan project Vite sesungguhnya
 *    (sama persis dengan hasil jalankan di localhost).
 *
 * Jalankan:
 *   npm run build
 *   node server.mjs
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';
const BASE_CHILD_PORT = 5400;
const PORT_SCAN = 200;
const DIST_DIR = path.resolve(__dirname, 'dist');
const WORK_DIR = path.resolve(__dirname, '.local-projects');
const MAX_RUNNING = 5;
const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{0,62}$/;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

const running = new Map();

function isFree(port) {
  return new Promise((resolve) => {
    const probe = net.createServer();
    probe.once('error', () => resolve(false));
    probe.once('listening', () => probe.close(() => resolve(true)));
    probe.listen(port, '127.0.0.1');
  });
}

async function findPort() {
  const used = new Set([...running.values()].map((entry) => entry.port));
  for (let port = BASE_CHILD_PORT; port < BASE_CHILD_PORT + PORT_SCAN; port += 1) {
    if (!used.has(port) && (await isFree(port))) return port;
  }
  throw new Error('Tidak ada port kosong untuk menjalankan project.');
}

async function stopProject(slug) {
  const current = running.get(slug);
  if (!current) return;
  running.delete(slug);
  await current.server.close();
}

async function getOrStartProject(slug) {
  const current = running.get(slug);
  if (current) return current;

  const targetDir = path.resolve(WORK_DIR, slug);
  if (!fs.existsSync(path.join(targetDir, 'vite.config.ts'))) {
    return null;
  }

  if (running.size >= MAX_RUNNING) {
    const oldest = running.keys().next().value;
    if (oldest) await stopProject(oldest);
  }

  const port = await findPort();
  const server = await createViteServer({
    root: targetDir,
    base: `/${slug}/live/`,
    configFile: path.join(targetDir, 'vite.config.ts'),
    clearScreen: false,
    logLevel: 'warn',
    server: { host: '127.0.0.1', port, strictPort: true, cors: false, fs: { allow: [__dirname] } },
  });
  await server.listen();
  const entry = { server, port };
  running.set(slug, entry);
  return entry;
}

function serveStatic(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback SPA ke dist/index.html
      const fallback = path.join(DIST_DIR, 'index.html');
      fs.readFile(fallback, (fallbackErr, content) => {
        if (fallbackErr) {
          res.statusCode = 404;
          res.end('Not Found');
          return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(content);
      });
      return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer(async (req, res) => {
  const url = req.url || '/';

  // 1. Live preview route: /:slug/live/*
  const liveMatch = url.match(/^\/([a-z0-9-]+)\/live(\/.*)?$/);
  if (liveMatch) {
    const slug = liveMatch[1];
    if (!SLUG_PATTERN.test(slug)) {
      res.statusCode = 400;
      res.end('Slug project tidak valid.');
      return;
    }

    // Redirect jika tanpa trailing slash
    if (!liveMatch[2] || liveMatch[2] === '') {
      const query = url.includes('?') ? url.slice(url.indexOf('?')) : '';
      res.writeHead(302, { Location: `/${slug}/live/${query}` });
      res.end();
      return;
    }

    try {
      const project = await getOrStartProject(slug);
      if (!project) {
        // Project belum dibangun di server
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(`<h3>Project '${slug}' belum dijalankan</h3><p>Silakan buka Modula untuk membuat atau menjalankan project ini.</p>`);
        return;
      }

      // Proxy request ke child Vite server
      const proxyReq = http.request(
        {
          hostname: '127.0.0.1',
          port: project.port,
          path: req.url,
          method: req.method,
          headers: {
            ...req.headers,
            host: `127.0.0.1:${project.port}`,
          },
        },
        (proxyRes) => {
          res.writeHead(proxyRes.statusCode ?? 200, proxyRes.headers);
          proxyRes.pipe(res);
        }
      );

      proxyReq.on('error', (err) => {
        if (!res.headersSent) {
          res.statusCode = 502;
          res.setHeader('Content-Type', 'text/plain');
          res.end(`Proxy error: ${err.message}`);
        }
      });

      req.on('error', (err) => {
        proxyReq.destroy(err);
      });

      req.pipe(proxyReq);
      return;
    } catch (err) {
      res.statusCode = 500;
      res.end(String(err));
      return;
    }
  }

  // 2. File statis Modula SPA
  const cleanPath = url.split('?')[0].replace(/\/+/g, '/');
  const safePath = path.normalize(path.join(DIST_DIR, cleanPath));
  if (!safePath.startsWith(DIST_DIR)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  // Jika folder, coba index.html
  if (fs.existsSync(safePath) && fs.statSync(safePath).isDirectory()) {
    serveStatic(res, path.join(safePath, 'index.html'));
  } else {
    serveStatic(res, safePath);
  }
});

// WebSocket tunnel untuk HMR
server.on('upgrade', (req, socket, head) => {
  const url = req.url || '';
  const match = url.match(/^\/([a-z0-9-]+)\/live/);
  if (!match) return;

  const slug = match[1];
  const project = running.get(slug);
  if (!project) return;

  const targetSocket = net.connect(project.port, '127.0.0.1', () => {
    targetSocket.write(
      `${req.method} ${req.url} HTTP/${req.httpVersion}\r\n` +
      Object.entries(req.headers)
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
        .join('\r\n') +
      '\r\n\r\n'
    );
    if (head && head.length > 0) targetSocket.write(head);
    targetSocket.pipe(socket);
    socket.pipe(targetSocket);
  });

  targetSocket.on('error', () => socket.destroy());
  socket.on('error', () => targetSocket.destroy());
});

server.listen(PORT, HOST, () => {
  console.log(`Modula Production Server listening on http://${HOST}:${PORT}`);
});
