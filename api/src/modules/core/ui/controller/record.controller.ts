import {
  Controller,
  Get,
  NotFoundException,
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

@ApiTags('record')
@Controller('api/records')
export class RecordController {
  constructor(
    private readonly annotationOrchestrator: AnnotationOrchestrator,
  ) {}

  @Get(':id')
  @ApiOperation({ description: "Get a record by it's id." })
  @ApiOkResponse({ type: GetRecordResponseDto })
  getRecord() {
    throw new NotFoundException();
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
