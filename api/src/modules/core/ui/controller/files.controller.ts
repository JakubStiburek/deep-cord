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
import { AudioFileOrchestrator } from '../../application/audio-file-orchestrator';
import { NotUniqueException } from '../../model/exception/not-unique.exception';
import { ListUploadedFilesResponseDto } from '../dto/list-uploaded-files.response.dto';
import { UploadFileDto } from '../dto/upload-file.dto';
import { TranscriptService } from '../../application/transcript.service';

@ApiTags('files')
@Controller('api/audio/files')
export class FilesController {
  private readonly logger = new Logger(FilesController.name);
  constructor(
    private readonly audioFileOrchestrator: AudioFileOrchestrator,
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
    const { id, name, uri, createdAt } = this.catchError(
      await this.audioFileOrchestrator.add(file, body),
    );

    return new FileDto(id, name, uri, createdAt);
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

  @Post(':id/transcriptions')
  async transcribeFile(@Param('id', ParseUUIDPipe) id: string) {
    await this.transcriptService.transcribe(id);
  }

  private catchError(value: any) {
    if (value instanceof NotUniqueException) {
      throw new ConflictException();
    }

    if (value instanceof Error) {
      throw new InternalServerErrorException();
    }

    return value;
  }
}
