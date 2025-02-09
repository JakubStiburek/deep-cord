import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { GetRecordResponseDto } from '../dto/get-record.response.dto';
import { AnnotationService } from '../../application/annotation-service';
import { AudioFileService } from '../../application/audio-file-service';
import { AnnotationDto } from '../dto/annotation.dto';
import { FileDto } from '../dto/file.dto';
import { CreateAnnotationDto } from '../dto/create-annotation.dto';
import { UpdateAnnotationDto } from '../dto/update-annotation.dto';
import { SpeakerListDto } from '../dto/speaker-list.dto';
import { SpeakerVOSchema } from '../../model/value-object/speaker.vo';

@ApiTags('Records')
@Controller('api/records')
export class RecordController {
  private readonly logger = new Logger(RecordController.name);
  constructor(
    private readonly audioFileService: AudioFileService,
    private readonly annotationService: AnnotationService,
  ) {}

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the file',
  })
  @ApiOperation({ description: "Get a record by it's file ID." })
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
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the file',
  })
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

  @Patch(':id/annotations/:annotationId')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the file',
  })
  @ApiOperation({ description: 'Add annotation to record' })
  @HttpCode(201)
  async updateAnnotation(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('annotationId', ParseUUIDPipe) annotationId: string,
    @Body() body: UpdateAnnotationDto,
  ) {
    try {
      await this.annotationService.update(id, body, annotationId);
    } catch (err) {
      this.handleError(err);
    }
  }

  @Delete(':id/annotations/:annotationId')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the file',
  })
  @ApiOperation({ description: 'Delete an annotation' })
  @HttpCode(201)
  async deleteAnnotation(
    @Param('annotationId', ParseUUIDPipe) annotationId: string,
  ) {
    try {
      await this.annotationService.delete(annotationId);
    } catch (err) {
      this.handleError(err);
    }
  }

  @Get(':id/speakers')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the file',
  })
  @ApiOperation({ description: 'Get list of speakers' })
  @ApiOkResponse({ type: SpeakerListDto })
  async getSpeakers(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return SpeakerListDto.fromDomain(
        await this.annotationService.getSpeakers(id),
      );
    } catch (err) {
      this.handleError(err);
    }
  }

  private handleError(err: unknown) {
    this.logger.error(err);
    if (err instanceof NotFoundException) {
      throw err;
    }

    if (err instanceof Error && err.message.includes('Invalid input')) {
      throw new BadRequestException();
    }

    throw new InternalServerErrorException();
  }
}
