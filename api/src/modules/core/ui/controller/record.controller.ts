import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Body,
  HttpCode,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetRecordResponseDto } from '../dto/get-record.response.dto';
import { AnnotationOrchestrator } from '../../application/annotation-orchestrator';
import { CreateAnnotationDto } from '../dto/create-annotation.dto';
import { AudioFileOrchestrator } from '../../application/audio-file-orchestrator';
import { AnnotationDto } from '../dto/annotation.dto';
import { FileDto } from '../dto/file.dto';

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
    const annotations =
      await this.annotationOrchestrator.getAnnotationsForRecord(id);
    const file = await this.audioFileOrchestrator.getById(id);

    if (file.isRight() && file.extract().isJust() && annotations.isRight()) {
      const { id, name, uri, createdAt } = file.extract().extract();
      const extractedAnnotations = annotations.extract();
      return new GetRecordResponseDto(
        new FileDto(id, name, uri, createdAt),
        extractedAnnotations.map((annotation) =>
          AnnotationDto.fromEntity(annotation.annotation),
        ),
      );
    }
  }

  @Post(':id/annotations')
  @ApiOperation({ description: 'Add annotation to record' })
  @HttpCode(201)
  async addAnnotation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: CreateAnnotationDto,
  ) {
    await this.annotationOrchestrator.add(id, body);
  }
}
