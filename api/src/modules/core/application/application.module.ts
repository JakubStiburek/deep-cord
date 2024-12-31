import { Module } from '@nestjs/common';
import { AudioFileOrchestrator } from './audio-file-orchestrator';
import { AudioFileRepositorySymbol } from '../model/repository/audio-file.repository';
import { AudioFileRepositoryPostgres } from '../infrastructure/audio-file-repository-postgres.implementation';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { PostgresClient } from '../../../common/database/postgres-client';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule, InfrastructureModule],
  providers: [
    {
      provide: AudioFileRepositorySymbol,
      useExisting: AudioFileRepositoryPostgres,
    },
    {
      provide: 'UPLOAD_DIRECTORY_PATH',
      useFactory: (configService: ConfigService) => {
        return configService.get('uploadDirectoryPath') || './uploads';
      },
      inject: [ConfigService],
    },
    ConfigService,
    AudioFileRepositoryPostgres,
    AudioFileOrchestrator,
    PostgresClient,
  ],
  exports: [AudioFileOrchestrator],
})
export class ApplicationModule {}
