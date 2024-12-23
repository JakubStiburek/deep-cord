import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/audio/records')
export class FilesControllerTsController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadAudioFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }
}
