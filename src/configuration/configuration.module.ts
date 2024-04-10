import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as path from 'node:path';
import validationSchema from './validation-schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV == 'dev'
          ? path.join(process.cwd(), '/.env.dev')
          : process.env.NODE_ENV == 'test'
            ? path.join(process.cwd(), '/.env.test')
            : path.join(process.cwd(), '/.env.prod'),
      validationSchema,
    }),
  ],
})
export class ConfigurationModule {}
