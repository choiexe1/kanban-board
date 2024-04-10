import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as path from 'node:path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV == 'dev'
          ? path.join(process.cwd(), '/.env.dev')
          : path.join(process.cwd(), '/.env.prod'),
    }),
  ],
})
export class ConfigurationModule {}
