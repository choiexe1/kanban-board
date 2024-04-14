import { Injectable } from '@nestjs/common';
import { JwtService as Jwt, JwtVerifyOptions } from '@nestjs/jwt';
import { TokenPayload } from './token-payload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
  constructor(
    private readonly jwt: Jwt,
    private readonly config: ConfigService,
  ) {}

  generateAccessToken(payload: TokenPayload) {
    return this.jwt.sign(payload, {
      secret: this.config.get('JWT_ACCESS_SECRET'),
      expiresIn: this.config.get<number>('JWT_ACCESS_EXPIRES_IN') + 'd',
    });
  }

  generateRefreshToken(payload: TokenPayload) {
    return this.jwt.sign(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get<number>('JWT_REFRESH_EXPIRES_IN') + 'd',
    });
  }

  verify(token: string, option: JwtVerifyOptions) {
    return this.jwt.verify(token, option);
  }
}
