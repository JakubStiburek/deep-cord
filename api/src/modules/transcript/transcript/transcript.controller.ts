import {
  Controller,
  NotFoundException,
  NotImplementedException,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('transcript')
@Controller('api/transcripts')
export class TranscriptController {
  @Post()
  createTranscript() {
    throw new NotFoundException();
  }
}
