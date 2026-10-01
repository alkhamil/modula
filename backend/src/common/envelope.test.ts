import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { okResponse, paginate } from './envelope';

describe('envelope', () => {
  it('okResponse membentuk envelope standar', () => {
    assert.deepEqual(okResponse({ a: 1 }), {
      response_schema: { response_code: '200', response_message: 'OK' },
      response_output: { a: 1 },
    });
    assert.deepEqual(okResponse(null, 'Dihapus.'), {
      response_schema: { response_code: '200', response_message: 'Dihapus.' },
      response_output: null,
    });
  });

  it('paginate memotong + clamp halaman', () => {
    const items = [1, 2, 3, 4, 5];
    const first = paginate(items, 1, 2);
    assert.deepEqual(first.pagination, {
      page: 1,
      size: 2,
      total_pages: 3,
      total_elements: 5,
    });
    assert.deepEqual(first.content, [1, 2]);
    const clamped = paginate(items, 99, 2);
    assert.equal(clamped.pagination.page, 3);
    assert.deepEqual(clamped.content, [5]);
    const empty = paginate([], 1, 10);
    assert.equal(empty.pagination.total_pages, 1);
    assert.deepEqual(empty.content, []);
  });
});
