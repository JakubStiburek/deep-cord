import { Module } from '@nestjs/common';
import { TranscriptController } from './controller/transcript.controller';

@Module({
  controllers: [TranscriptController],
})
export class TranscriptModule {}
