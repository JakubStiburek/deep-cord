import { Module } from '@nestjs/common';
import { UiModule } from './ui/ui.module';

@Module({
  imports: [UiModule],
})
export class CoreModule {}
