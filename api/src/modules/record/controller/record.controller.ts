import { Controller, Get, NotFoundException } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetRecordResponseDto } from '../dto/get-record.response.dto';

@ApiTags('record')
@Controller('api/records')
export class RecordController {
  @Get(':id')
  @ApiOperation({ description: "Get a record by it's id." })
  @ApiOkResponse({ type: GetRecordResponseDto })
  getRecord() {
    throw new NotFoundException();
  }
}
