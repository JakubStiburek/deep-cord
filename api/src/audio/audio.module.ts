import { Module } from '@nestjs/common';
import { FilesControllerTsController } from './controller/files.controller';

@Module({
  controllers: [FilesControllerTsController],
})
export class AudioModule {}
