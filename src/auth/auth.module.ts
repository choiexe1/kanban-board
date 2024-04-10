import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { LocalStrategy } from './strategy/local.strategy';
import { BcryptService } from 'src/bcrypt/bcrypt.service';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, BcryptService, LocalStrategy],
})
export class AuthModule {}
