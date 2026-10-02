import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcryptjs';
import type { Repository } from 'typeorm';
import { okResponse, type ApiResponse } from '../common/envelope';
import { UserEntity } from './entities/user.entity';
import type { LoginDto } from './dto';

export interface AuthUserJson {
  username: string;
  name: string;
  role: string;
}

export interface LoginOutput {
  user: AuthUserJson;
  token: string;
  permissions: string[];
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
    private readonly jwt: JwtService,
  ) {}

  /** Login: verifikasi kredensial → JWT + profil + permissions. 401 bila salah. */
  async login(dto: LoginDto): Promise<ApiResponse<LoginOutput>> {
    const username = dto.username.trim().toLowerCase();
    const user = await this.users.findOne({ where: { username } });
    const matches = user ? await bcrypt.compare(dto.password, user.passwordHash) : false;
    if (!user || !matches) {
      throw new UnauthorizedException('Username atau password salah.');
    }
    const token = await this.jwt.signAsync({ sub: user.id, username: user.username });
    return okResponse({
      user: { username: user.username, name: user.name, role: user.role },
      token,
      permissions: user.permissions,
    });
  }

  /** Logout stateless (JWT): FE yang membuang token; BE hanya konfirmasi. */
  async logout(): Promise<ApiResponse<{ success: boolean }>> {
    return okResponse({ success: true });
  }
}
