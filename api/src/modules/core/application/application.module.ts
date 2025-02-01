import { Module } from '@nestjs/common';
import { AudioFileService } from './audio-file-service';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as postgres from 'postgres';
import { AnnotationService } from './annotation-service';
import { TranscriptService } from './transcript.service';

@Module({
  imports: [ConfigModule, InfrastructureModule],
  providers: [
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
    {
      provide: 'DEEPGRAM_API_KEY',
      useFactory: (configService: ConfigService) => {
        return configService.get('deepgram.apiKey');
      },
      inject: [ConfigService],
    },
    {
      provide: 'CLOUDINARY_CREDENTIALS',
      useFactory: (configService: ConfigService) => {
        return {
          name: configService.get('cloudinary.name'),
          apiKey: configService.get('cloudinary.apiKey'),
          apiSecret: configService.get('cloudinary.apiSecret'),
        };
      },
      inject: [ConfigService],
    },
    ConfigService,
    AudioFileService,
    AnnotationService,
    TranscriptService,
  ],
  exports: [AudioFileService, AnnotationService, TranscriptService],
})
export class ApplicationModule {}
