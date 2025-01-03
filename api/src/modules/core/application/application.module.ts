import { Module } from '@nestjs/common';
import { AudioFileOrchestrator } from './audio-file-orchestrator';
import { AudioFileRepositorySymbol } from '../model/repository/audio-file.repository';
import { AudioFileRepositoryPostgres } from '../infrastructure/audio-file-repository-postgres.implementation';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as postgres from 'postgres';
import { AnnotationOrchestrator } from './annotation-orchestrator';
import { AnnotationRepositorySymbol } from '../model/repository/annotation.repository';
import { AnnotationRepositoryPostgres } from '../infrastructure/annotation-repository-postgres.implementation';

@Module({
  imports: [ConfigModule, InfrastructureModule],
  providers: [
    {
      provide: AudioFileRepositorySymbol,
      useExisting: AudioFileRepositoryPostgres,
    },
    {
      provide: AnnotationRepositorySymbol,
      useExisting: AnnotationRepositoryPostgres,
    },
    {
      provide: 'UPLOAD_DIRECTORY_PATH',
      useFactory: (configService: ConfigService) => {
        return configService.get('uploadDirectoryPath') || './uploads';
      },
      inject: [ConfigService],
    },
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
    AudioFileRepositoryPostgres,
    AnnotationRepositoryPostgres,
    AudioFileOrchestrator,
    AnnotationOrchestrator,
  ],
  exports: [AudioFileOrchestrator, AnnotationOrchestrator],
})
export class ApplicationModule {}
