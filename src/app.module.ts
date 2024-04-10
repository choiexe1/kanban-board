import { Module } from '@nestjs/common';
import { ConfigurationModule } from './configuration/configuration.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { BcryptService } from './bcrypt/bcrypt.service';

@Module({
  imports: [ConfigurationModule, DatabaseModule, UserModule],
  providers: [BcryptService],
})
export class AppModule {}
