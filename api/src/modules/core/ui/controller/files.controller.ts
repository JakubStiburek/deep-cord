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
  ParseUUIDPipe,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiTags,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { FileDto } from '../dto/file.dto';
import { AudioFileService } from '../../application/audio-file-orchestrator';
import { NotUniqueException } from '../../model/exception/not-unique.exception';
import { ListUploadedFilesResponseDto } from '../dto/list-uploaded-files.response.dto';
import { UploadFileDto } from '../dto/upload-file.dto';
import { TranscriptService } from '../../application/transcript.service';
import { AudioFile } from '../../model/entity/audio-file.entity';
import { error } from 'node:console';

@ApiTags('files')
@Controller('api/audio/files')
export class FilesController {
  private readonly logger = new Logger(FilesController.name);
  constructor(
    private readonly audioFileOrchestrator: AudioFileService,
    private readonly transcriptService: TranscriptService,
  ) {}

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
    try {
      const { id, name, uri, createdAt, transcribed } =
        await this.audioFileOrchestrator.add(file, body);

      return new FileDto(id, name, uri, createdAt, transcribed);
    } catch (err) {
      this.handleError(err);
    }
  }

  @Get()
  @ApiOperation({
    description: 'List files in storage.',
  })
  @ApiOkResponse({ type: ListUploadedFilesResponseDto })
  async listUploadedFiles() {
    try {
      const result = await this.audioFileOrchestrator.getAll();

      return new ListUploadedFilesResponseDto(
        result.map(
          (file) =>
            new FileDto(
              file.id,
              file.name,
              file.uri,
              file.createdAt,
              file.transcribed,
            ),
        ),
      );
    } catch (err) {
      this.handleError(err);
    }
  }

  @Post(':id/transcriptions')
  async transcribeFile(@Param('id', ParseUUIDPipe) id: string) {
    await this.transcriptService.transcribe(id);
  }

  private handleError(err: unknown) {
    if (err instanceof NotUniqueException) {
      this.logger.log('what');
      this.logger.warn(err);
      throw new ConflictException();
    }

    this.logger.error(err);
    throw new InternalServerErrorException();
  }
}
