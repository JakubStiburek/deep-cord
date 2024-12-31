import {
  ConflictException,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiTags,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { FileDto } from '../dto/file.dto';
import { AudioFileOrchestrator } from '../../application/audio-file-orchestrator';
import { NotUniqueException } from '../../model/exception/not-unique.exception';
import { ListUploadedFilesResponseDto } from '../dto/list-uploaded-files.response.dto';
import { UploadFileDto } from '../dto/upload-file.dto';

@ApiTags('files')
@Controller('api/audio/files')
export class FilesController {
  private readonly logger = new Logger(FilesController.name);
  constructor(private readonly audioFileOrchestrator: AudioFileOrchestrator) {}

  @Post()
  @ApiOperation({
    description: 'Upload audio files to storage.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: FileDto })
  @UseInterceptors(FileInterceptor('file'))
  async uploadAudioFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadFileDto,
  ) {
    const result = await this.audioFileOrchestrator.add(file, body);

    return result
      .mapLeft((err) => {
        this.logger.warn(err);
        if (err instanceof NotUniqueException) {
          throw new ConflictException();
        }
        throw new InternalServerErrorException();
      })
      .map(({ id, name, uri, createdAt }) => {
        return new FileDto(id, name, uri, createdAt);
      })
      .extract();
  }

  @Get()
  @ApiOperation({
    description: 'List files in storage.',
  })
  @ApiOkResponse({ type: ListUploadedFilesResponseDto })
  async listUploadedFiles() {
    const result = await this.audioFileOrchestrator.getAll();

    return result
      .mapLeft((err) => {
        this.logger.warn(err);
        throw new InternalServerErrorException();
      })
      .map((files) => {
        return new ListUploadedFilesResponseDto(
          files.map(
            (file) => new FileDto(file.id, file.name, file.uri, file.createdAt),
          ),
        );
      })
      .extract();
  }
}
