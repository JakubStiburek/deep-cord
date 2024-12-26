import { Module } from '@nestjs/common';
import { RecordController } from './controller/record.controller';

@Module({
  controllers: [RecordController],
})
export class RecordModule {}
