import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.get('DATABASE_HOST'),
        port: cfg.get('DATABASE_PORT'),
        username: cfg.get('DATABASE_USER'),
        password: cfg.get('DATABASE_PASSWORD'),
        database: cfg.get('DATABASE_NAME'),
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
