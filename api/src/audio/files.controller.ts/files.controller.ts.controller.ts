import * as fs from 'fs';
import {
  Controller,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/audio/records')
export class FilesControllerTsController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadAudioFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('extension') extension: string,
  ) {
    const ext = extension || '.mp3';
    const path = `./uploads/record-${file.filename}-${new Date().toISOString()}.${ext}`;
    await fs.promises.writeFile(path, file.buffer);
    return { path };
  }
}
