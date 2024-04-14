import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from 'src/jwt/token-payload.interface';
import { UserService } from 'src/user/user.service';
import { Request } from 'express';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: TokenPayload) {
    const user = await this.userService.findOne({ id: payload.id });

    if (!user) {
      throw new BadRequestException('유효하지 않은 토큰입니다.');
    }

    const refreshToken = this.extractToken(req);

    if (user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    return user;
  }

  extractToken(req: Request) {
    return req.headers.authorization.split(' ')[1];
  }
}
