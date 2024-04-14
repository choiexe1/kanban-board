import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as path from 'node:path';

config({
  path: './.env.dev',
});

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.getOrThrow('DATABASE_HOST'),
  port: configService.getOrThrow('DATABASE_PORT'),
  username: configService.getOrThrow('DATABASE_USER'),
  password: configService.getOrThrow('DATABASE_PASSWORD'),
  database: configService.getOrThrow('DATABASE_NAME'),
  synchronize: false,
  entities: [path.join(process.cwd(), '/**/*.entity.*')],
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
  namingStrategy: new SnakeNamingStrategy(),
});
