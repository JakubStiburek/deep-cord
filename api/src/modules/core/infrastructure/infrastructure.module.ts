import { Module } from '@nestjs/common';
import { AudioFileRepositoryPostgres } from './audio-file-repository-postgres.implementation';
import { AudioFileEntityRepositoryPostgres } from './audio-file-entity-repository-postgres.implementation';

@Module({
  providers: [AudioFileRepositoryPostgres, AudioFileEntityRepositoryPostgres],
  exports: [AudioFileRepositoryPostgres, AudioFileEntityRepositoryPostgres],
})
export class InfrastructureModule {}
