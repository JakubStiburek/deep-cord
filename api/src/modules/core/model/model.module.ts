import { Module } from '@nestjs/common';
import { AudioFileRepositorySymbol } from './repository/audio-file.repository';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';

@Module({
  imports: [InfrastructureModule],
  exports: [AudioFileRepositorySymbol],
})
export class ModelModule {}
