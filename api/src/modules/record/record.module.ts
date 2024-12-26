import { Module } from '@nestjs/common';
import { RecordController } from './controller/record.controller';
import { ModelModule } from './model/model.module';

@Module({
  controllers: [RecordController],
  imports: [ModelModule],
})
export class RecordModule {}
