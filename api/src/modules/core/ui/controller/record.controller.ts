import {
  Body,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetRecordResponseDto } from '../dto/get-record.response.dto';
import { AnnotationOrchestrator } from '../../application/annotation-orchestrator';
import { AudioFileOrchestrator } from '../../application/audio-file-orchestrator';
import { AnnotationDto } from '../dto/annotation.dto';
import { FileDto } from '../dto/file.dto';
import { AudioFile } from '../../model/entity/audio-file.entity';
import { AnnotationAggregate } from '../../model/aggregate/annotation.aggregate';
import { CreateAnnotationDto } from '../dto/create-annotation.dto';

@ApiTags('record')
@Controller('api/records')
export class RecordController {
  constructor(
    private readonly audioFileOrchestrator: AudioFileOrchestrator,
    private readonly annotationOrchestrator: AnnotationOrchestrator,
  ) {}

  @Get(':id')
  @ApiOperation({ description: "Get a record by it's id." })
  @ApiOkResponse({ type: GetRecordResponseDto })
  async getRecord(@Param('id', ParseUUIDPipe) id: string) {
    const annotations = this.catchError<AnnotationAggregate[]>(
      await this.annotationOrchestrator.getAnnotationsForRecord(id),
    );
    const {
      id: fileId,
      name,
      uri,
      createdAt,
    } = this.catchError<AudioFile>(
      await this.audioFileOrchestrator.getById(id),
    );

    return new GetRecordResponseDto(
      new FileDto(fileId, name, uri, createdAt),
      annotations.map((annotation) =>
        AnnotationDto.fromEntity(annotation.annotation),
      ),
    );
  }

  @Post(':id/annotations')
  @ApiOperation({ description: 'Add annotation to record' })
  @HttpCode(201)
  async addAnnotation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: CreateAnnotationDto,
  ) {
    this.catchError(await this.annotationOrchestrator.add(id, body));
  }

  private catchError<T>(value: any) {
    if (value instanceof Error) {
      throw new InternalServerErrorException();
    }

    return value as T;
  }
}
