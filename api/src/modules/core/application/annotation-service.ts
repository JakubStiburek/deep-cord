import { Inject } from '@nestjs/common';
import { Sql } from 'postgres';
import { CreateAnnotationDto } from '../ui/dto/create-annotation.dto';
import { AnnotationAggregateRepository } from '../model/repository/annotation-aggregate.repository';
import { AnnotationAggregateRepositoryPostgres } from '../infrastructure/annotation-aggregate-repository-postgres.implementation';
import { AudioFileEntityRepositoryPostgres } from '../infrastructure/audio-file-entity-repository-postgres.implementation';
import { AudioFileEntityRepository } from '../model/repository/audio-file-entity.repository';
import { UpdateAnnotationDto } from '../ui/dto/update-annotation.dto';
import {
  updateAnnotationSpan,
  updateAnnotationValue,
} from '../model/entity/annotation.entity';
import { AnnotationAggregateSchema } from '../model/aggregate/annotation.aggregate';
import { AnnotationTypeEnum } from '../model/enum/annotation-type.enum';
import { SpeakerVOSchema } from '../model/value-object/speaker.vo';

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
        1,
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

  async delete(id: string) {
    await this.sql`delete from annotation where id = ${id}`;
  }

  async update(fileId: string, dto: UpdateAnnotationDto, annotationId: string) {
    return await this.sql.begin(async (sql) => {
      const file = await this.fileRepository.getById(fileId, sql);
      const { annotation } = await this.annotationRepository.getById(
        annotationId,
        file,
        sql,
      );

      const annotationWithUpdatedSpan = updateAnnotationSpan(
        annotation,
        dto.span.start,
        dto.span.end,
      );

      const annotationWithUpdatedValue = updateAnnotationValue(
        annotationWithUpdatedSpan,
        dto.value,
      );

      const aggregate = AnnotationAggregateSchema.parse({
        annotation: annotationWithUpdatedValue,
        file,
      });

      return await this.annotationRepository.save(aggregate, sql);
    });
  }

  async getSpeakers(fileId: string) {
    return await this.sql.begin(async (sql) => {
      const speakers = await sql<
        { value: string }[]
      >`select distinct value from annotation where file_id = ${fileId} and type = ${AnnotationTypeEnum.SPEAKER}`;

      return speakers.map((speaker) =>
        SpeakerVOSchema.parse({ value: speaker.value }),
      );
    });
  }
}
