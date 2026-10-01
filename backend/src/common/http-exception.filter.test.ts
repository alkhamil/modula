import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';

function mockHost(): {
  host: Parameters<HttpExceptionFilter['catch']>[1];
  sent: { status: number; body: unknown };
} {
  const sent: { status: number; body: unknown } = { status: 0, body: null };
  const res = {
    status: (code: number) => ({
      json: (body: unknown) => {
        sent.status = code;
        sent.body = body;
      },
    }),
  };
  const host = { switchToHttp: () => ({ getResponse: () => res }) } as Parameters<
    HttpExceptionFilter['catch']
  >[1];
  return { host, sent };
}

describe('HttpExceptionFilter', () => {
  it('HttpException → envelope + status asli', () => {
    const { host, sent } = mockHost();
    new HttpExceptionFilter().catch(new NotFoundException('Data tidak ditemukan.'), host);
    assert.deepEqual(sent, {
      status: 404,
      body: {
        response_schema: { response_code: '404', response_message: 'Data tidak ditemukan.' },
        response_output: null,
      },
    });
  });

  it('pesan array (validasi) digabung', () => {
    const { host, sent } = mockHost();
    new HttpExceptionFilter().catch(
      new BadRequestException(['a wajib diisi.', 'b tidak valid.']),
      host,
    );
    assert.deepEqual(sent, {
      status: 400,
      body: {
        response_schema: {
          response_code: '400',
          response_message: 'a wajib diisi.; b tidak valid.',
        },
        response_output: null,
      },
    });
  });

  it('error non-HTTP → 500 envelope', () => {
    const { host, sent } = mockHost();
    new HttpExceptionFilter().catch(new Error('boom'), host);
    assert.equal(sent.status, 500);
    assert.deepEqual((sent.body as { response_output: unknown }).response_output, null);
  });
});
