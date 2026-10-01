import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { spawn, type ChildProcess } from 'node:child_process';
import path from 'node:path';
import request from 'supertest';

/**
 * E2E black-box: menyalakan server build (`dist/main.js`) di port terpisah
 * lalu menembak HTTP. Butuh MySQL jalan (compose.yaml).
 */
const PORT = Number(process.env.E2E_PORT ?? 3100);
const BASE_URL = `http://127.0.0.1:${PORT}`;
const BACKEND_ROOT = path.resolve(__dirname, '..', '..');

let server: ChildProcess | null = null;

async function waitForHealth(): Promise<void> {
  const deadline = Date.now() + 30000;
  for (;;) {
    try {
      const res = await request(BASE_URL).get('/api/v1/health');
      if (res.status === 200) return;
    } catch {
      /* server belum siap — coba lagi */
    }
    if (Date.now() > deadline) throw new Error('BE tidak siap dalam 30 detik.');
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

describe('App (e2e)', () => {
  before(async () => {
    server = spawn('node', ['dist/main.js'], {
      cwd: BACKEND_ROOT,
      env: { ...process.env, PORT: String(PORT) },
      stdio: 'pipe',
    });
    await waitForHealth();
  });

  after(() => {
    server?.kill();
    server = null;
  });

  it('GET /api/v1/health → 200 { status: ok }', async () => {
    const res = await request(BASE_URL).get('/api/v1/health');
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { status: 'ok' });
  });
});
