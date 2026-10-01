import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('status() → { status: ok }', () => {
    assert.deepEqual(new HealthController().status(), { status: 'ok' });
  });
});
