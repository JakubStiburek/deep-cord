import { Logger, NotFoundException } from '@nestjs/common';
import { Sql } from 'postgres';
import { AudioFileEntity } from '../model/entity/audio-file.entity';
import { AnnotationAggregateRepository } from '../model/repository/annotation-aggregate.repository';
import { AnnotationSpanVO } from '../model/value-object/annotation-span.vo';
import { AnnotationTypeVO } from '../model/value-object/annotation-type.vo';
import { Annotation } from '../../../common/database/deep-cord-db-schema';
import {
  convertToAnnotationSpanVo,
  convertToMilis,
} from './annotation-span.adapter';
import { AnnotationTypeEnum } from '../model/enum/annotation-type.enum';
import {
  AnnotationAggregate,
  AnnotationAggregateSchema,
} from '../model/aggregate/annotation.aggregate';

export class AnnotationAggregateRepositoryPostgres
  implements AnnotationAggregateRepository
{
  private readonly logger = new Logger(
    AnnotationAggregateRepositoryPostgres.name,
  );

  async getById(
    id: string,
    file: AudioFileEntity,
    sql: Sql,
  ): Promise<AnnotationAggregate> {
    try {
      const [annotation] = await sql<
        Annotation[]
      >`select * from annotation where id = ${id}`;

      if (!annotation) {
        throw new NotFoundException();
      }

      const aggregate = {
        annotation: {
          id: annotation.id,
          span: convertToAnnotationSpanVo(
            annotation.start_time,
            annotation.end_time,
          ),
          type: {
            value: annotation.type as AnnotationTypeEnum,
          },
          value:
            annotation.type === AnnotationTypeEnum.CONFIDENCE
              ? Number(annotation.value)
              : annotation.value,
        },
        file,
      };

      return AnnotationAggregateSchema.parse(aggregate);
    } catch (err) {
      this.logger.warn('Failed at method getById', { err });
      throw err;
    }
  }

  async add(
    file: AudioFileEntity,
    span: AnnotationSpanVO,
    type: AnnotationTypeVO,
    value: string | number,
    sql: Sql,
  ) {
    try {
      const { start_time, end_time } = convertToMilis(span);

      const [annotation] = await sql<
        Annotation[]
      >`insert into annotation (start_time, end_time, type, value, file_id) values (${start_time}, ${end_time}, ${type.value}, ${value}, ${file.id}) returning *`;

      const aggregate = {
        annotation: {
          id: annotation.id,
          span: convertToAnnotationSpanVo(
            annotation.start_time,
            annotation.end_time,
          ),
          type: {
            value: annotation.type as AnnotationTypeEnum,
          },
          value:
            annotation.type === AnnotationTypeEnum.CONFIDENCE
              ? Number(annotation.value)
              : annotation.value,
        },
        file,
      };

      return AnnotationAggregateSchema.parse(aggregate);
    } catch (err) {
      this.logger.warn('Failed at method add', { err });
      throw err;
    }
  }

  async save(aggregate: AnnotationAggregate, sql: Sql) {
    try {
      const { start_time, end_time } = convertToMilis(
        aggregate.annotation.span,
      );

      await sql<
        Annotation[]
      >`update annotation set start_time = ${start_time}, end_time = ${end_time},  value = ${aggregate.annotation.value} where id = ${aggregate.annotation.id} returning *`;

      return AnnotationAggregateSchema.parse(aggregate);
    } catch (err) {
      this.logger.warn('Failed at method add', { err });
      throw err;
    }
  }

  async addBatch(
    file: AudioFileEntity,
    annotations: {
      span: AnnotationSpanVO;
      type: AnnotationTypeVO;
      value: string | number;
    }[],
    sql: Sql,
  ) {
    try {
      const adaptedAnnotations = annotations.map((item) => ({
        start_time: convertToMilis(item.span).start_time,
        end_time: convertToMilis(item.span).end_time,
        type: item.type.value,
        value: item.value,
        file_id: file.id,
      }));

      const batch = await sql<
        Annotation[]
      >`insert into annotation ${sql(adaptedAnnotations)} returning *`;

      batch.forEach((annotation) => {
        try {
          AnnotationAggregateSchema.parse({
            annotation: {
              id: annotation.id,
              span: convertToAnnotationSpanVo(
                annotation.start_time,
                annotation.end_time,
              ),
              type: {
                value: annotation.type as AnnotationTypeEnum,
              },
              value:
                annotation.type === AnnotationTypeEnum.CONFIDENCE
                  ? Number(annotation.value)
                  : annotation.value,
            },
            file,
          });
        } catch (err) {
          this.logger.log({ err, annotation });
          throw err;
        }
      });
    } catch (err) {
      this.logger.warn('Failed at method addBatch', { err });
      throw err;
    }
  }

  async getAnnotationsForRecord(file: AudioFileEntity, sql: Sql) {
    try {
      const annotations = await sql<
        Annotation[]
      >`select id, start_time, end_time, type, value, created_at from annotation where file_id = ${file.id}`;

      if (annotations.length === 0) {
        return [];
      }

      return annotations.map((annotation) =>
        AnnotationAggregateSchema.parse({
          annotation: {
            id: annotation.id,
            span: convertToAnnotationSpanVo(
              annotation.start_time,
              annotation.end_time,
            ),
            type: {
              value: annotation.type as AnnotationTypeEnum,
            },
            value:
              annotation.type === AnnotationTypeEnum.CONFIDENCE
                ? Number(annotation.value)
                : annotation.value,
          },
          file,
        }),
      );
    } catch (err) {
      this.logger.warn('Failed at method getAnnotationsForRecord', { err });
      throw err;
    }
  }
}
