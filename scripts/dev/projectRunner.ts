/**
 * Dev-only: jalankan project hasil wizard sebagai server Vite sendiri di localhost, mis.
 * `http://localhost:5300/nama-project/`. Tidak ada di production build / preview.
 *
 * Keamanan (endpoint ini menjalankan kode, jadi sengaja ketat):
 * - Server TIDAK menerima file. Klien hanya mengirim opsi wizard (nama, id pack, gaya, tema, warna, logo);
 *   semuanya divalidasi dengan daftar yang diizinkan, lalu project disusun dari template repo sendiri,
 *   sehingga yang dijalankan selalu kode dari repo.
 * - Hanya permintaan same-origin dari halaman Modula (header Origin/Host + Sec-Fetch-Site) yang membawa
 *   token acak per sesi dev (disuntikkan ke index.html) yang diterima.
 * - Server project hanya bind ke `localhost`, CORS dimatikan, jumlah project bersamaan dibatasi.
 * - Logo hanya ditulis sebagai file statis (ekstensi dan ukuran dibatasi; SVG berskrip ditolak).
 */
import { randomBytes } from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import net from 'node:net';
import path from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { pathToFileURL } from 'node:url';
import { createServer, type Plugin, type ViteDevServer } from 'vite';

const BASE_PORT = 5300;
const PORT_SCAN = 200;
const WORK_DIR = '.local-projects';
const MAX_BODY_BYTES = 2 * 1024 * 1024;
const MAX_LOGO_BYTES = 512 * 1024;
const MAX_RUNNING = 5;
const LOGO_EXTENSIONS = new Set(['svg', 'png', 'jpg', 'webp']);
const THEMES = new Set(['light', 'dark']);
const STYLES = new Set(['classic', 'light', 'top', 'rail', 'floating']);
const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;
const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{0,62}$/;
const TOKEN_META = 'modula-run-token';

interface Running {
  server: ViteDevServer;
  port: number;
}

interface RunPayload {
  name: string;
  selectedPacks: string[];
  options: {
    theme: string;
    uiStyle: string;
    primaryColor?: string;
    brand?: { logo?: LogoPayload; collapsedLogo?: LogoPayload };
  };
}

interface LogoPayload {
  ext: string;
  base64: string;
}

const running = new Map<string, Running>();

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function readBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    req.on('data', (chunk: Buffer) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error('Permintaan terlalu besar.'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

/** Tolak permintaan lintas-origin dan yang tanpa token sesi; kembalikan pesan galat atau null bila lolos. */
function authorize(req: IncomingMessage, token: string): string | null {
  const host = String(req.headers.host ?? '');
  const origin = String(req.headers.origin ?? '');
  if (!/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host)) return 'Host tidak diizinkan.';
  if (origin !== `http://${host}`) return 'Origin tidak diizinkan.';
  const fetchSite = req.headers['sec-fetch-site'];
  if (fetchSite !== undefined && fetchSite !== 'same-origin') return 'Permintaan lintas-origin ditolak.';
  if (!String(req.headers['content-type'] ?? '').startsWith('application/json')) return 'Content-Type harus application/json.';
  if (req.headers['x-modula-token'] !== token) return 'Token tidak valid.';
  return null;
}

function decodeLogo(logo: LogoPayload | undefined, label: string): { ext: string; bytes: Uint8Array } | undefined {
  if (!logo) return undefined;
  if (typeof logo.ext !== 'string' || !LOGO_EXTENSIONS.has(logo.ext)) throw new Error(`Ekstensi ${label} tidak didukung.`);
  if (typeof logo.base64 !== 'string') throw new Error(`Isi ${label} tidak valid.`);
  const bytes = Buffer.from(logo.base64, 'base64');
  if (bytes.length === 0 || bytes.length > MAX_LOGO_BYTES) throw new Error(`Ukuran ${label} tidak valid.`);
  if (logo.ext === 'svg') {
    const text = bytes.toString('utf8');
    if (/<script|\son[a-z]+\s*=|javascript:/i.test(text)) throw new Error(`${label} SVG mengandung skrip.`);
  }
  return { ext: logo.ext, bytes: new Uint8Array(bytes) };
}

function parsePayload(raw: unknown, allowedPacks: Set<string>): RunPayload {
  const body = raw as Partial<RunPayload> | null;
  if (!body || typeof body !== 'object') throw new Error('Body tidak valid.');
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  if (!name || name.length > 100) throw new Error('Nama project tidak valid.');
  if (!Array.isArray(body.selectedPacks) || body.selectedPacks.length > 50) throw new Error('Daftar pack tidak valid.');
  for (const id of body.selectedPacks) {
    if (typeof id !== 'string' || !allowedPacks.has(id)) throw new Error(`Pack tidak dikenal: ${String(id)}`);
  }
  const options = body.options;
  if (!options || typeof options !== 'object') throw new Error('Opsi tidak valid.');
  if (!THEMES.has(options.theme)) throw new Error('Tema tidak valid.');
  if (!STYLES.has(options.uiStyle)) throw new Error('Gaya tidak valid.');
  if (options.primaryColor !== undefined && options.primaryColor !== '' && !HEX_COLOR.test(options.primaryColor)) {
    throw new Error('Warna primary tidak valid.');
  }
  return { name, selectedPacks: body.selectedPacks, options };
}

function isFree(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const probe = net.createServer();
    probe.once('error', () => resolve(false));
    probe.once('listening', () => probe.close(() => resolve(true)));
    probe.listen(port, '127.0.0.1');
  });
}

async function findPort(): Promise<number> {
  const used = new Set([...running.values()].map((entry) => entry.port));
  for (let port = BASE_PORT; port < BASE_PORT + PORT_SCAN; port += 1) {
    if (!used.has(port) && (await isFree(port))) return port;
  }
  throw new Error('Tidak ada port kosong untuk menjalankan project.');
}

async function stopProject(slug: string): Promise<void> {
  const current = running.get(slug);
  if (!current) return;
  running.delete(slug);
  await current.server.close();
}

/** Muat sumber template + mesin penyusun dari repo (bukan dari klien). */
async function loadComposer(devServer: ViteDevServer) {
  const root = devServer.config.root;
  const sources = (await import(pathToFileURL(path.join(root, 'scripts/project/fs-sources.mjs')).href)) as {
    loadBase: () => Record<string, string>;
    loadDesignSystem: () => Record<string, string>;
    loadPacks: () => { manifest: { id: string }; files: Record<string, string> }[];
  };
  const compose = (await devServer.ssrLoadModule('/src/modules/creator/engine/compose.ts')) as {
    composeProject: (input: Record<string, unknown>) => Record<string, string>;
    composeProjectAssets: (project: Record<string, unknown>) => Record<string, Uint8Array>;
    slugifyProjectName: (name: string) => string;
  };
  return { sources, compose };
}

async function startProject(devServer: ViteDevServer, raw: unknown): Promise<{ url: string; port: number; slug: string; files: number }> {
  const { sources, compose } = await loadComposer(devServer);
  const packs = sources.loadPacks();
  const payload = parsePayload(raw, new Set(packs.map((pack) => pack.manifest.id)));
  const slug = compose.slugifyProjectName(payload.name);
  if (!SLUG_PATTERN.test(slug)) throw new Error('Slug project tidak valid.');

  const project = {
    name: payload.name,
    slug,
    theme: payload.options.theme,
    uiStyle: payload.options.uiStyle,
    primaryColor: payload.options.primaryColor || undefined,
    brand: {
      logo: decodeLogo(payload.options.brand?.logo, 'logo'),
      collapsedLogo: decodeLogo(payload.options.brand?.collapsedLogo, 'ikon collapsed'),
    },
  };
  const files = compose.composeProject({
    base: sources.loadBase(),
    designSystem: sources.loadDesignSystem(),
    packs,
    selected: payload.selectedPacks,
    project,
  });
  const assets = compose.composeProjectAssets(project);

  await stopProject(slug);
  if (running.size >= MAX_RUNNING) {
    const oldest = running.keys().next().value;
    if (oldest) await stopProject(oldest);
  }

  const root = devServer.config.root;
  const targetDir = path.resolve(root, WORK_DIR, slug);
  fs.rmSync(targetDir, { recursive: true, force: true });
  let count = 0;
  for (const [relative, content] of [...Object.entries(files), ...Object.entries(assets)]) {
    const absolute = path.resolve(targetDir, relative);
    if (!absolute.startsWith(targetDir + path.sep)) throw new Error(`Path tidak valid: ${relative}`);
    fs.mkdirSync(path.dirname(absolute), { recursive: true });
    fs.writeFileSync(absolute, content);
    count += 1;
  }

  const port = await findPort();
  const server = await createServer({
    root: targetDir,
    base: '/',
    configFile: path.join(targetDir, 'vite.config.ts'),
    clearScreen: false,
    logLevel: 'warn',
    server: { host: '127.0.0.1', port, strictPort: true, cors: false, fs: { allow: [root] } },
  });
  await server.listen();
  running.set(slug, { server, port });
  return { url: `http://localhost:${port}/`, port, slug, files: count };
}

async function getOrStartExistingProject(devServer: ViteDevServer, slug: string): Promise<Running | null> {
  const current = running.get(slug);
  if (current) return current;

  const root = devServer.config.root;
  const targetDir = path.resolve(root, WORK_DIR, slug);
  if (!fs.existsSync(path.join(targetDir, 'vite.config.ts'))) {
    return null;
  }

  if (running.size >= MAX_RUNNING) {
    const oldest = running.keys().next().value;
    if (oldest) await stopProject(oldest);
  }

  const port = await findPort();
  const server = await createServer({
    root: targetDir,
    base: '/',
    configFile: path.join(targetDir, 'vite.config.ts'),
    clearScreen: false,
    logLevel: 'warn',
    server: { host: '127.0.0.1', port, strictPort: true, cors: false, fs: { allow: [root] } },
  });
  await server.listen();
  const entry: Running = { server, port };
  running.set(slug, entry);
  return entry;
}

export function projectRunnerPlugin(): Plugin {
  const token = randomBytes(24).toString('hex');
  return {
    name: 'project-runner',
    apply: 'serve',
    // Token hanya ada di HTML yang disajikan ke halaman same-origin (CORS dimatikan di vite.config).
    transformIndexHtml: () => [{ tag: 'meta', attrs: { name: TOKEN_META, content: token }, injectTo: 'head' }],
    configureServer(devServer) {
      devServer.httpServer?.on('close', () => {
        for (const slug of [...running.keys()]) void stopProject(slug);
      });

      // Forward WebSocket untuk Vite HMR di child dev server
      devServer.httpServer?.on('upgrade', (req, socket, head) => {
        const url = req.url || '';
        const match = url.match(/^\/([a-z0-9-]+)\/live/);
        if (!match) return;

        const slug = match[1];
        if (!slug) return;
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

        targetSocket.on('error', () => {
          socket.destroy();
        });
        socket.on('error', () => {
          targetSocket.destroy();
        });
      });

      // Proxy semua permintaan `/:slug/live/*` ke child Vite server
      devServer.middlewares.use(async (req, res, next) => {
        const url = req.url || '';
        const match = url.match(/^\/([a-z0-9-]+)\/live(\/.*)?$/);
        if (!match) return next();

        const slug = match[1];
        if (!slug || !SLUG_PATTERN.test(slug)) return next();

        // Redirect jika tanpa trailing slash pada root live preview
        if (!match[2] || match[2] === '') {
          const query = url.includes('?') ? url.slice(url.indexOf('?')) : '';
          res.writeHead(302, { Location: `/${slug}/live/${query}` });
          res.end();
          return;
        }

        try {
          const project = await getOrStartExistingProject(devServer, slug);
          if (!project) {
            return next();
          }

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
        } catch (err) {
          next(err);
        }
      });

      const guarded = (handler: (req: IncomingMessage, res: ServerResponse, body: unknown) => Promise<void>) =>
        (req: IncomingMessage, res: ServerResponse) => {
          if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed.' });
          const denied = authorize(req, token);
          if (denied) return sendJson(res, 403, { error: denied });
          readBody(req)
            .then((buffer) => JSON.parse(buffer.toString('utf8') || '{}') as unknown)
            .then((body) => handler(req, res, body))
            .catch((error: unknown) => sendJson(res, 400, { error: error instanceof Error ? error.message : String(error) }));
        };

      devServer.middlewares.use(
        '/__api/run-project',
        guarded(async (_req, res, body) => sendJson(res, 200, await startProject(devServer, body))),
      );

      devServer.middlewares.use(
        '/__api/stop-project',
        guarded(async (_req, res, body) => {
          const slug = (body as { slug?: unknown } | null)?.slug;
          if (typeof slug !== 'string' || !SLUG_PATTERN.test(slug)) throw new Error('Slug project tidak valid.');
          await stopProject(slug);
          sendJson(res, 200, { ok: true });
        }),
      );
    },
  };
}
