import {
  Body,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Logger,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetRecordResponseDto } from '../dto/get-record.response.dto';
import { AnnotationService } from '../../application/annotation-service';
import { AudioFileService } from '../../application/audio-file-service';
import { AnnotationDto } from '../dto/annotation.dto';
import { FileDto } from '../dto/file.dto';
import { CreateAnnotationDto } from '../dto/create-annotation.dto';

@ApiTags('Records')
@Controller('api/records')
export class RecordController {
  private readonly logger = new Logger(RecordController.name);
  constructor(
    private readonly audioFileService: AudioFileService,
    private readonly annotationService: AnnotationService,
  ) {}

  @Get(':id')
  @ApiOperation({ description: "Get a record by it's id." })
  @ApiOkResponse({ type: GetRecordResponseDto })
  async getRecord(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const annotations =
        await this.annotationService.getAnnotationsForRecord(id);

      const {
        id: fileId,
        name,
        uri,
        createdAt,
        transcribed,
      } = await this.audioFileService.getById(id);

      return new GetRecordResponseDto(
        new FileDto(fileId, name, uri, createdAt, transcribed),
        annotations.map((annotation) =>
          AnnotationDto.fromEntity(annotation.annotation),
        ),
      );
    } catch (err) {
      this.handleError(err);
    }
  }

  @Post(':id/annotations')
  @ApiOperation({ description: 'Add annotation to record' })
  @HttpCode(201)
  async addAnnotation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: CreateAnnotationDto,
  ) {
    try {
      await this.annotationService.add(id, body);
    } catch (err) {
      this.handleError(err);
    }
  }

  private handleError(err: unknown) {
    this.logger.error(err);
    throw new InternalServerErrorException();
  }
}
