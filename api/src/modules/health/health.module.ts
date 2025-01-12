import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as postgres from 'postgres';
import { NeonDBHealthIndicator } from './neon-db-health-indicator';

@Module({
  imports: [TerminusModule, HttpModule, ConfigModule],
  providers: [
    {
      provide: 'POSTGRES_CLIENT',
      useFactory: (configService: ConfigService) => {
        const pgConfig = configService.getOrThrow<{
          pg_host: string;
          pg_database: string;
          pg_user: string;
          pg_password: string;
        }>('postgres');

        const nodeEnv = configService.get('node_env');

        return postgres('postgres://username:password@host/database', {
          username: pgConfig.pg_user,
          password: pgConfig.pg_password,
          host: pgConfig.pg_host,
          database: pgConfig.pg_database,
          ssl: nodeEnv === 'local' ? undefined : 'require',
        });
      },
      inject: [ConfigService],
    },
    ConfigService,
    NeonDBHealthIndicator,
  ],
  controllers: [HealthController],
})
export class HealthModule {}
