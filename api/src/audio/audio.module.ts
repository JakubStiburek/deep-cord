import { Module } from '@nestjs/common';
import { FilesController } from './controller/files.controller';

@Module({
  controllers: [FilesController],
})
export class AudioModule {}
