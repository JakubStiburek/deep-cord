import * as fs from 'fs';
import {
  Controller,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiQuery } from '@nestjs/swagger';

@Controller('api/audio/records')
export class FilesControllerTsController {
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiQuery({
    name: 'extension',
    type: String,
    description:
      'Extension is inferred from filename, this field overrides it. If non is provided file extension defaults to mp3.',
    example: 'mp3',
    required: false,
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadAudioFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('extension') extension?: string,
  ) {
    const directory = './uploads';

    if (!fs.existsSync(directory)) {
      await fs.promises.mkdir(directory);
    }

    const filename = {
      name: file.originalname.split('.')[0],
      extension: file.originalname.split('.')[1],
    };

    const ext = extension || filename.extension || 'mp3';
    const path = `./uploads/record-${filename.name}-${new Date().toISOString()}.${ext}`;

    await fs.promises.writeFile(path, file.buffer);

    return { path };
  }
}
