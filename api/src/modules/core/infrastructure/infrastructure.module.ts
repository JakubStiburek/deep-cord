import { Module } from '@nestjs/common';
import { AudioFileEntityRepositoryPostgres } from './audio-file-entity-repository-postgres.implementation';
import { AnnotationAggregateRepositoryPostgres } from './annotation-aggregate-repository-postgres.implementation';

@Module({
  providers: [
    AudioFileEntityRepositoryPostgres,
    AnnotationAggregateRepositoryPostgres,
  ],
  exports: [
    AudioFileEntityRepositoryPostgres,
    AnnotationAggregateRepositoryPostgres,
  ],
})
export class InfrastructureModule {}
