import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildRecordQuery,
  toQueryMeta,
  uniqueFieldNames,
  valueTypeOf,
  type QueryFieldMeta,
} from './record-query';

const FIELDS: QueryFieldMeta[] = [
  { name: 'name', type: 'textField', filterable: true, filterCriteria: 'contains', rules: ['required'] },
  { name: 'code', type: 'textField', filterable: true, filterCriteria: 'exact', rules: ['unique'] },
  { name: 'qty', type: 'numberField', filterable: true, filterCriteria: 'numberRange', rules: [] },
  { name: 'price', type: 'numberField', filterable: true, filterCriteria: 'numberMin', rules: [] },
  { name: 'dob', type: 'dateField', filterable: true, filterCriteria: 'dateRange', rules: [] },
  { name: 'period', type: 'dateRangeField', filterable: true, filterCriteria: 'dateOverlap', rules: [] },
  { name: 'role', type: 'selectField', filterable: true, filterCriteria: 'optionExact', rules: [] },
  { name: 'tags', type: 'selectMultipleField', filterable: true, filterCriteria: 'optionAny', rules: [] },
  { name: 'active', type: 'checkboxField', filterable: true, filterCriteria: 'booleanExact', rules: [] },
  { name: 'secret', type: 'passwordField', filterable: false, filterCriteria: null, rules: [] },
];

describe('record-query', () => {
  it('valueTypeOf memetakan tipe FE', () => {
    assert.equal(valueTypeOf('textField'), 'string');
    assert.equal(valueTypeOf('numberField'), 'number');
    assert.equal(valueTypeOf('switchField'), 'boolean');
    assert.equal(valueTypeOf('selectMultipleField'), 'stringArray');
    assert.equal(valueTypeOf('fileUploadField'), 'file');
    assert.equal(valueTypeOf('unknown'), 'string');
  });

  it('uniqueFieldNames hanya rule unique', () => {
    assert.deepEqual(uniqueFieldNames(FIELDS), ['code']);
  });

  it('default: tanpa order → field pertama ASC, page 1 size 10', () => {
    const built = buildRecordQuery(FIELDS, {});
    assert.deepEqual(built.where, []);
    assert.ok(built.orderExpr.includes('$."name"'));
    assert.equal(built.orderDir, 'ASC');
    assert.equal(built.page, 1);
    assert.equal(built.size, 10);
  });

  it('search mencakup field string + array + id', () => {
    const built = buildRecordQuery(FIELDS, { search: 'Bo' });
    assert.equal(built.where.length, 1);
    const clause = built.where[0] ?? '';
    assert.ok(clause.includes('LOWER(record.data->>\'$."name"\') LIKE'));
    assert.ok(clause.includes('CAST(record.data->\'$."tags"\' AS CHAR)'));
    assert.ok(clause.includes('CAST(record.id AS CHAR) LIKE'));
    assert.ok(!clause.includes('$."qty"'));
    assert.deepEqual(built.params, { p0: '%bo%' });
  });

  it('status exact + contains + exact', () => {
    const built = buildRecordQuery(FIELDS, { status: 'active', name: 'x', code: 'A1' });
    assert.ok(built.where.some((w) => w === 'record.status = :p0'));
    assert.ok(built.where.some((w) => w.includes('LIKE')));
    assert.ok(built.where.some((w) => w.includes('= :p2')));
  });

  it('numberRange memakai Min/Max, non-angka diabaikan', () => {
    const built = buildRecordQuery(FIELDS, { qtyMin: '2', qtyMax: '9', price: 'abc' });
    assert.ok(built.where.some((w) => w.includes('>= :p0')));
    assert.ok(built.where.some((w) => w.includes('<= :p1')));
    assert.ok(!built.where.some((w) => w.includes('$."price"')));
    assert.deepEqual(built.params, { p0: 2, p1: 9 });
  });

  it('dateRange BETWEEN + dateOverlap irisan', () => {
    const built = buildRecordQuery(FIELDS, {
      dob: '2024-01-01,2024-01-31',
      period: '2024-02-01,2024-02-28',
    });
    assert.ok(built.where.some((w) => w.includes('BETWEEN')));
    const overlap = built.where.find((w) => w.includes('SUBSTRING_INDEX'));
    assert.ok(overlap?.includes('<= :p2') && overlap.includes('>= :p3'));
    const incomplete = buildRecordQuery(FIELDS, { dob: '2024-01-01' });
    assert.ok(!incomplete.where.some((w) => w.includes('BETWEEN')));
  });

  it('optionAny JSON_OVERLAPS + booleanExact', () => {
    const built = buildRecordQuery(FIELDS, { tags: 'a,b', active: 'true' });
    assert.ok(built.where.some((w) => w.includes('JSON_OVERLAPS')));
    assert.ok(built.where.some((w) => w.includes('= :p1')));
    assert.deepEqual(built.params.p0, JSON.stringify(['a', 'b']));
  });

  it('field non-filterable diabaikan', () => {
    const built = buildRecordQuery(FIELDS, { secret: 'x' });
    assert.ok(!built.where.some((w) => w.includes('secret')));
  });

  it('sort numerik CAST + key tak dikenal → id', () => {
    const num = buildRecordQuery(FIELDS, { order: 'qty', sort: 'desc' });
    assert.ok(num.orderExpr.includes('CAST'));
    assert.equal(num.orderDir, 'DESC');
    const unknown = buildRecordQuery(FIELDS, { order: 'nope' });
    assert.equal(unknown.orderExpr, 'record.id');
    const sys = buildRecordQuery(FIELDS, { order: 'created_date' });
    assert.equal(sys.orderExpr, 'record.createdAt');
  });

  it('page/size dibatasi', () => {
    const built = buildRecordQuery(FIELDS, { page: '0', size: '9999' });
    assert.equal(built.page, 1);
    assert.equal(built.size, 100);
  });

  it('toQueryMeta menormalkan JSON longgar', () => {
    const meta = toQueryMeta([{ name: 'a' }, {}]);
    assert.equal(meta[0]?.type, 'textField');
    assert.equal(meta[0]?.filterable, true);
    assert.equal(meta[1]?.name, '');
  });
});
