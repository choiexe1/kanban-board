import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { LocalStrategy } from './strategy/local.strategy';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { JwtService } from 'src/jwt/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy } from './strategy/access-token.strategy';
import { RtStrategy } from './strategy/refresh-token.strategy';

@Module({
  imports: [UserModule, JwtModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    BcryptService,
    LocalStrategy,
    JwtService,
    AtStrategy,
    RtStrategy,
  ],
})
export class AuthModule {}
