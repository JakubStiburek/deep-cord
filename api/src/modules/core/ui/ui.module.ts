import { Module } from '@nestjs/common';
import { FilesController } from './controller/files.controller';
import { RecordController } from './controller/record.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApplicationModule } from '../application/application.module';

@Module({
  imports: [ConfigModule, ApplicationModule],
  controllers: [FilesController, RecordController],
})
export class UiModule {}
