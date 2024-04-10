import { Module } from '@nestjs/common';
import { ConfigurationModule } from './configuration/configuration.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { BcryptService } from './bcrypt/bcrypt.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigurationModule, DatabaseModule, UserModule, AuthModule],
  providers: [BcryptService],
})
export class AppModule {}
