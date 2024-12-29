import { Module } from '@nestjs/common';
import { RecordController } from './controller/record.controller';
import { ModelModule } from './model/model.module';
import { FilesController } from './controller/files.controller';
import { ConfigService } from '@nestjs/config';
import { PostgresClient } from '../../common/database/postgres-client';

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
    PostgresClient,
  ],
})
export class CoreModule {}
