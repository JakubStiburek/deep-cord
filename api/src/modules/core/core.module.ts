import { Module } from '@nestjs/common';
import { RecordController } from './controller/record.controller';
import { ModelModule } from './model/model.module';
import { FilesController } from './controller/files.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [RecordController, FilesController],
  imports: [ModelModule],
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
export class CoreModule {}
