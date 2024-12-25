import { Module } from '@nestjs/common';
import { FilesController } from './controller/files.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [FilesController],
  providers: [
    {
      provide: 'UPLOAD_DIRECTORY_PATH',
      useFactory: (configService: ConfigService) => {
        return configService.get('uploadDirectoryPath') || './uploads';
      },
      inject: [ConfigService],
    },
    ConfigService,
  ],
})
export class AudioModule {}
