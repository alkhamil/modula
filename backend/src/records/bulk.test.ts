import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  bulkExampleRow,
  bulkHeaders,
  exportCellValue,
  exportHeaders,
  validateBulkRow,
} from './bulk';

const FIELDS = [
  { name: 'name', label: 'Name', type: 'textField', rules: ['required', 'min:3', 'max:10'], source: 'none' },
  { name: 'email', label: 'Email', type: 'textField', rules: ['required', 'email', 'unique'], source: 'none' },
  { name: 'qty', label: 'Qty', type: 'numberField', rules: ['required', 'min:2'], source: 'none' },
  { name: 'dob', label: 'Dob', type: 'dateField', rules: [], source: 'none' },
  { name: 'period', label: 'Period', type: 'dateRangeField', rules: ['required'], source: 'none' },
  { name: 'role', label: 'Role', type: 'selectField', rules: ['required'], source: 'mockStatic', options: [{ label: 'Admin', value: 'admin' }] },
  { name: 'tags', label: 'Tags', type: 'selectMultipleField', rules: [], source: 'mockStatic', options: [{ label: 'A', value: 'a' }] },
  { name: 'active', label: 'Active', type: 'checkboxField', rules: [], source: 'none' },
  { name: 'doc', label: 'Doc', type: 'fileUploadField', rules: [], source: 'none' },
];

const neverTaken = (): boolean => false;

describe('bulk', () => {
  it('bulkHeaders: dateRange pecah Start/End, file dilewat', () => {
    assert.deepEqual(bulkHeaders(FIELDS), [
      'Name',
      'Email',
      'Qty',
      'Dob',
      'Period Start',
      'Period End',
      'Role',
      'Tags',
      'Active',
    ]);
  });

  it('bulkExampleRow sejajar headers', () => {
    const headers = bulkHeaders(FIELDS);
    const example = bulkExampleRow(FIELDS);
    assert.equal(example.length, headers.length);
    assert.equal(example[2], 100);
    assert.equal(example[8], 'Ya');
  });

  it('exportHeaders + exportCellValue', () => {
    assert.deepEqual(exportHeaders([{ label: 'Name' }]), ['Name', 'Status', 'Created Date']);
    assert.equal(exportCellValue('checkboxField', true), 'Yes');
    assert.equal(exportCellValue('switchField', false), 'No');
    assert.equal(exportCellValue('selectMultipleField', ['a', 'b']), 'a, b');
    assert.equal(exportCellValue('textField', 'x'), 'x');
    assert.equal(exportCellValue('textField', null), '');
  });

  it('baris valid → payload terisi semua kind', () => {
    const res = validateBulkRow(
      FIELDS,
      {
        Name: 'Budi',
        Email: 'budi@x.com',
        Qty: '5',
        Dob: '2024-01-15',
        'Period Start': '2024-01-01',
        'Period End': '2024-01-31',
        Role: 'admin',
        Tags: 'a',
        Active: 'Ya',
      },
      neverTaken,
    );
    assert.deepEqual(res.errors, []);
    assert.deepEqual(res.payload, {
      name: 'Budi',
      email: 'budi@x.com',
      qty: 5,
      dob: '2024-01-15',
      period: '2024-01-01,2024-01-31',
      role: 'admin',
      tags: ['a'],
      active: true,
      doc: '',
    });
  });

  it('required + panjang + email + angka + tanggal', () => {
    const res = validateBulkRow(
      FIELDS,
      { Name: 'Bo', Email: 'bukan-email', Qty: 'abc', Dob: '15-01-2024', Period: '' },
      neverTaken,
    );
    const byField = new Map(res.errors.map((e) => [e.field, e.message]));
    assert.equal(byField.get('Name'), 'Name minimal 3 karakter.');
    assert.equal(byField.get('Email'), 'Email format email tidak valid.');
    assert.equal(byField.get('Qty'), 'Qty harus angka.');
    assert.equal(byField.get('Dob'), 'Dob formatnya YYYY-MM-DD.');
    assert.equal(res.payload, null);
  });

  it('maksimal + required dateRange + membership + bool', () => {
    const res = validateBulkRow(
      FIELDS,
      { Name: 'Terlalu Panjang Sekali', Role: 'super', Active: 'mungkin' },
      neverTaken,
    );
    const messages = res.errors.map((e) => e.message);
    assert.ok(messages.includes('Name maksimal 10 karakter.'));
    assert.ok(messages.includes('Period wajib diisi awal dan akhir.'));
    assert.ok(messages.includes('Role harus salah satu: admin.'));
    assert.ok(messages.includes('Active diisi Ya atau Tidak.'));
  });

  it('unique via isTaken + multi membership', () => {
    const taken = (field: string): boolean => field === 'email';
    const res = validateBulkRow(FIELDS, { Name: 'Budi', Email: 'a@x.com', Tags: 'zzz' }, taken);
    assert.ok(res.errors.some((e) => e.message === 'Email sudah dipakai.'));
    assert.ok(res.errors.some((e) => e.message === 'Tags berisi nilai tidak dikenal: zzz'));
  });

  it('regex + withoutemoticon + min number', () => {
    const fields = [
      { name: 'code', label: 'Code', type: 'textField', rules: ['regex:^\\d+$'], source: 'none' },
      { name: 'nick', label: 'Nick', type: 'textField', rules: ['withoutemoticon'], source: 'none' },
      { name: 'qty', label: 'Qty', type: 'numberField', rules: ['min:2'], source: 'none' },
    ];
    const res = validateBulkRow(fields, { Code: 'AB', Nick: 'hi 😀', Qty: '1' }, neverTaken);
    assert.ok(res.errors.some((e) => e.message === 'Code format tidak valid.'));
    assert.ok(res.errors.some((e) => e.message === 'Nick tidak boleh mengandung emoticon.'));
    assert.ok(res.errors.some((e) => e.message === 'Qty minimal 2.'));
  });
});
