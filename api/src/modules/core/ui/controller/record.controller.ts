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
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
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
import { RenameSpeakerDto } from '../dto/rename-speaker.dto';
import { SpeakerNotUniqueException } from '../../model/exception/speaker-not-unique.exception';

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
  @ApiNotFoundResponse({ description: "Record doesn't exist" })
  @ApiBadRequestResponse({ description: 'Input validation failed' })
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
  @HttpCode(201)
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the file',
  })
  @ApiOperation({ description: 'Add annotation to record' })
  @ApiCreatedResponse({ description: 'Successfully added annotation' })
  @ApiNotFoundResponse({ description: "Record doesn't exist" })
  @ApiBadRequestResponse({ description: 'Input validation failed' })
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
  @HttpCode(204)
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the file',
  })
  @ApiOperation({ description: 'Add annotation to record' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: "Record or annotation doesn't exist" })
  @ApiBadRequestResponse({ description: 'Input validation failed' })
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
  @HttpCode(204)
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the file',
  })
  @ApiOperation({ description: 'Delete an annotation' })
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ description: 'Input validation failed' })
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
  @ApiNotFoundResponse({ description: "Record doesn't exist" })
  @ApiBadRequestResponse({ description: 'Input validation failed' })
  async getSpeakers(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return SpeakerListDto.fromDomain(
        await this.annotationService.getSpeakers(id),
      );
    } catch (err) {
      this.handleError(err);
    }
  }

  @Put(':id/speakers')
  @HttpCode(204)
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the file',
  })
  @ApiOperation({ description: 'Change name of a speaker.' })
  @ApiNoContentResponse({ description: "Successfully updated speaker's name" })
  @ApiConflictResponse({
    description: 'Speaker with that name is already used for this record',
  })
  @ApiNotFoundResponse({ description: "Record doesn't exist" })
  @ApiBadRequestResponse({ description: 'Input validation failed' })
  async renameSpeaker(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: RenameSpeakerDto,
  ) {
    try {
      await this.annotationService.renameSpeaker(id, {
        old: body.speaker,
        new: body.renameTo,
      });
    } catch (err) {
      this.handleError(err);
    }
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the file',
  })
  @ApiOperation({
    description: 'Delete audio file and associated annotations',
  })
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ description: 'Input validation failed' })
  async deleteRecord(@Param('id', ParseUUIDPipe) id: string) {
    try {
      await this.annotationService.deleteRecord(id);
    } catch (err) {
      this.handleError(err);
    }
  }

  private handleError(err: unknown) {
    this.logger.error(err);
    if (err instanceof NotFoundException) {
      throw err;
    }

    if (err instanceof SpeakerNotUniqueException) {
      throw err;
    }

    if (err instanceof Error && err.message.includes('Invalid input')) {
      throw new BadRequestException();
    }

    throw new InternalServerErrorException();
  }
}
