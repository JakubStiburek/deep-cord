import { Inject } from '@nestjs/common';
import { Sql } from 'postgres';
import { CreateAnnotationDto } from '../ui/dto/create-annotation.dto';
import { AnnotationAggregateRepository } from '../model/repository/annotation-aggregate.repository';
import { AnnotationAggregateRepositoryPostgres } from '../infrastructure/annotation-aggregate-repository-postgres.implementation';
import { AudioFileEntityRepositoryPostgres } from '../infrastructure/audio-file-entity-repository-postgres.implementation';
import { AudioFileEntityRepository } from '../model/repository/audio-file-entity.repository';

export class AnnotationService {
  constructor(
    @Inject('POSTGRES_CLIENT')
    private readonly sql: Sql,

    @Inject(AnnotationAggregateRepositoryPostgres)
    private readonly annotationRepository: AnnotationAggregateRepository,

    @Inject(AudioFileEntityRepositoryPostgres)
    private readonly fileRepository: AudioFileEntityRepository,
  ) {}

  async add(fileId: string, dto: CreateAnnotationDto) {
    return await this.sql.begin(async (sql) => {
      const file = await this.fileRepository.getById(fileId, sql);

      return await this.annotationRepository.add(
        file,
        { start: dto.span.start, end: dto.span.end },
        { value: dto.type },
        dto.value,
        sql,
      );
    });
  }

  async getAnnotationsForRecord(fileId: string) {
    return await this.sql.begin(async (sql) => {
      const file = await this.fileRepository.getById(fileId, sql);

      return await this.annotationRepository.getAnnotationsForRecord(file, sql);
    });
  }
}
