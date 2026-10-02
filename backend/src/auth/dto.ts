import { IsString, MaxLength, MinLength } from 'class-validator';

/** Body POST /api/v1/auth/login (cermin LoginPayload FE). */
export class LoginDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  username!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  password!: string;
}
