import { Module } from '@nestjs/common';
import { ConfigurationModule } from './configuration/configuration.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { BcryptService } from './bcrypt/bcrypt.service';
import { AuthModule } from './auth/auth.module';
import { JwtService } from './jwt/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { TeamModule } from './team/team.module';
import { InviteModule } from './invite/invite.module';

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule,
    UserModule,
    AuthModule,
    JwtModule,
    TeamModule,
    InviteModule,
  ],
  providers: [BcryptService, JwtService],
})
export class AppModule {}
