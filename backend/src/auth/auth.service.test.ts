import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { UnauthorizedException } from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import type { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import type { UserEntity } from './entities/user.entity';

const PASSWORD = 'admin123';
// Hash bcrypt asli (cost 4, cepat untuk test) agar compare() teruji beneran.
const PASSWORD_HASH = bcrypt.hashSync(PASSWORD, 4);

function user(over: Partial<UserEntity> = {}): UserEntity {
  return {
    id: 1,
    username: 'admin',
    passwordHash: PASSWORD_HASH,
    name: 'Administrator',
    role: 'admin',
    permissions: ['*'],
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    ...over,
  } as UserEntity;
}

function setup(found: UserEntity | null = user()) {
  const repo = {
    findOne: async () => found,
  } as unknown as Repository<UserEntity>;
  const signed: unknown[] = [];
  const jwt = {
    signAsync: async (payload: unknown) => {
      signed.push(payload);
      return 'test-jwt-token';
    },
  } as unknown as JwtService;
  return { service: new AuthService(repo, jwt), signed };
}

describe('AuthService', () => {
  it('login sukses: user + token + permissions', async () => {
    const { service, signed } = setup();
    const res = await service.login({ username: ' Admin ', password: PASSWORD });
    assert.equal(res.response_output?.token, 'test-jwt-token');
    assert.deepEqual(res.response_output?.user, {
      username: 'admin',
      name: 'Administrator',
      role: 'admin',
    });
    assert.deepEqual(res.response_output?.permissions, ['*']);
    assert.deepEqual(signed, [{ sub: 1, username: 'admin' }]);
  });

  it('login 401 bila username tidak ada', async () => {
    const { service } = setup(null);
    await assert.rejects(
      service.login({ username: 'ghost', password: PASSWORD }),
      UnauthorizedException,
    );
  });

  it('login 401 bila password salah', async () => {
    const { service } = setup();
    await assert.rejects(
      service.login({ username: 'admin', password: 'salah' }),
      (err: unknown) =>
        err instanceof UnauthorizedException &&
        err.message === 'Username atau password salah.',
    );
  });

  it('logout mengembalikan sukses', async () => {
    const { service } = setup();
    const res = await service.logout();
    assert.equal(res.response_output?.success, true);
  });
});
