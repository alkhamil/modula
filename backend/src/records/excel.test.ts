import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildWorkbook, readWorkbookRows, XLSX_MIME } from './excel';

describe('excel', () => {
  it('build → read roundtrip', () => {
    const buffer = buildWorkbook(
      ['Name', 'Qty'],
      [
        ['Budi', 5],
        ['Siti', 10],
      ],
    );
    assert.ok(Buffer.isBuffer(buffer));
    assert.ok(buffer.length > 0);
    const { headers, rows } = readWorkbookRows(buffer);
    assert.deepEqual(headers, ['Name', 'Qty']);
    assert.deepEqual(rows, [
      { Name: 'Budi', Qty: 5 },
      { Name: 'Siti', Qty: 10 },
    ]);
  });

  it('buffer kosong → headers/rows kosong', () => {
    const buffer = buildWorkbook(['A'], []);
    const { headers, rows } = readWorkbookRows(buffer);
    assert.deepEqual(headers, ['A']);
    assert.deepEqual(rows, []);
  });

  it('MIME xlsx benar', () => {
    assert.equal(
      XLSX_MIME,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
  });
});
