import { Module } from '@nestjs/common';
import { TranscriptController } from './transcript/transcript.controller';

@Module({
  controllers: [TranscriptController]
})
export class TranscriptModule {}
