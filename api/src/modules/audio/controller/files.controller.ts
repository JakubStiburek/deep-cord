import * as fs from 'fs';
import {
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiBody,
  ApiQuery,
  ApiTags,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { UploadAudioFileResponseDto } from '../dto/upload-audio-file.response.dto';
import { ListUploadedFilesResponseDto } from '../dto/list-uploaded-files.response.dto';

@ApiTags('audio')
@Controller('api/audio/records')
export class FilesController {
  constructor(
    @Inject('UPLOAD_DIRECTORY_PATH')
    private readonly uploadDirectoryPath: string,
  ) {}

  @Post()
  @ApiOperation({
    description: 'Upload audio files to storage.',
  })
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
      'Extension is inferred from filename, this field overrides it. If none is provided file extension defaults to mp3.',
    example: 'mp3',
    required: false,
  })
  @ApiOkResponse({ type: UploadAudioFileResponseDto })
  @UseInterceptors(FileInterceptor('file'))
  async uploadAudioFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('extension') extension?: string,
  ): Promise<UploadAudioFileResponseDto> {
    try {
      await fs.promises.access(this.uploadDirectoryPath, fs.constants.W_OK);
    } catch (_) {
      await fs.promises.mkdir(this.uploadDirectoryPath, { recursive: true });
    }

    const filename = {
      name: file.originalname.split('.')[0],
      extension: file.originalname.split('.')[1],
    };

    const ext = extension || filename.extension || 'mp3';
    const date = new Date().toISOString().split('T')[0];
    const uri = `${this.uploadDirectoryPath}/record-${filename.name}-${date}.${ext}`;

    await fs.promises.writeFile(uri, file.buffer);

    return new UploadAudioFileResponseDto(uri);
  }

  @Get()
  @ApiOperation({
    description: 'List files in storage.',
  })
  @ApiOkResponse({ type: ListUploadedFilesResponseDto })
  async listUploadedFiles(): Promise<ListUploadedFilesResponseDto> {
    try {
      await fs.promises.access(this.uploadDirectoryPath, fs.constants.R_OK);
    } catch (_) {
      return new ListUploadedFilesResponseDto([]);
    }

    const files = await fs.promises.readdir(this.uploadDirectoryPath);

    return new ListUploadedFilesResponseDto(files, this.uploadDirectoryPath);
  }
}
