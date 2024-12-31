import { Module } from '@nestjs/common';
import { AudioFileRepositoryPostgres } from './audio-file-repository-postgres.implementation';

@Module({
  providers: [AudioFileRepositoryPostgres],
  exports: [AudioFileRepositoryPostgres],
})
export class InfrastructureModule {}
