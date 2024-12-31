import { Module } from '@nestjs/common';
import { FilesController } from './controller/files.controller';
import { RecordController } from './controller/record.controller';
import { ApplicationModule } from '../application/application.module';

@Module({
  imports: [ApplicationModule],
  controllers: [FilesController, RecordController],
})
export class UiModule {}
