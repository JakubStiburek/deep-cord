import { Module } from '@nestjs/common';
import { FilesControllerTsController } from './files.controller.ts/files.controller.ts.controller';

@Module({
  controllers: [FilesControllerTsController]
})
export class AudioModule {}
