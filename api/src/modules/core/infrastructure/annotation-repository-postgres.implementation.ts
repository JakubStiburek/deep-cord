import { Either, Left, Right } from 'purify-ts';
import { AudioFile } from '../model/entity/audio-file.entity';
import { UncaughtException } from '../model/exception/uncaught.exception';
import { AnnotationRepository } from '../model/repository/annotation.repository';
import { AnnotationSpan } from '../model/value-object/annotation-span.vo';
import {
  AnnotationType,
  AnnotationTypeEnum,
} from '../model/value-object/annotation-type.vo';
import { Sql } from 'postgres';
import { AnnotationAggregate } from '../model/aggregate/annotation.aggregate';
import { Annotation as AnnotationSchema } from '../../../common/database/deep-cord-db-schema';
import { Annotation } from '../model/entity/annotation.entity';
import { AnnotationSpanAdapter } from './annotation-span.adapter';
import { Logger } from '@nestjs/common';
import { validateSync } from 'class-validator';
import { InvariantViolationException } from '../model/exception/invariant-violation.exception';

export class AnnotationRepositoryPostgres implements AnnotationRepository {
  private readonly logger = new Logger(AnnotationRepositoryPostgres.name);
  async add(
    file: AudioFile,
    span: AnnotationSpan,
    type: AnnotationType,
    value: string | number,
    sql: Sql,
  ): Promise<Either<UncaughtException, AnnotationAggregate>> {
    try {
      const { startTime, endTime } =
        AnnotationSpanAdapter.fromAnnotationSpan(span);

      const [annotation] = await sql<
        AnnotationSchema[]
      >`insert into annotation (start_time, end_time, type, value, file_id) values (${startTime}, ${endTime}, ${type.type}, ${value}, ${file.id}) returning *`;

      const aggregate = new AnnotationAggregate(
        new Annotation(
          annotation.id,
          AnnotationSpanAdapter.fromMiliseconds(
            annotation.start_time,
            annotation.end_time,
          ),
          new AnnotationType(annotation.type as AnnotationTypeEnum),
          annotation.type === AnnotationTypeEnum.CONFIDENCE
            ? Number(annotation.value)
            : annotation.value,
        ),
        file,
      );

      if (validateSync(aggregate).length > 0) {
        this.logger.log({ validation: validateSync(aggregate) });
        return Left(new InvariantViolationException());
      }

      return Right(aggregate);
    } catch (err) {
      this.logger.warn({ err });
      return Left(
        new UncaughtException(
          `${AnnotationRepositoryPostgres.name} uncaught exception`,
        ),
      );
    }
  }

  async getAnnotationsForRecord(
    file: AudioFile,
    sql: Sql,
  ): Promise<Either<UncaughtException, AnnotationAggregate[]>> {
    try {
      const annotations = await sql<
        AnnotationSchema[]
      >`select id, start_time, end_time, type, value, created_at from annotation where file_id = ${file.id}`;

      if (annotations.length === 0) {
        return Right([]);
      }

      const mapped = annotations.map((annotation) => {
        const agg = new AnnotationAggregate(
          new Annotation(
            annotation.id,
            AnnotationSpanAdapter.fromMiliseconds(
              annotation.start_time,
              annotation.end_time,
            ),
            new AnnotationType(annotation.type as AnnotationTypeEnum),
            annotation.type === AnnotationTypeEnum.CONFIDENCE
              ? Number(annotation.value)
              : annotation.value,
          ),
          file,
        );

        const validation = validateSync(agg);
        if (validation.length > 0) {
          this.logger.log({ validation });
          throw new InvariantViolationException();
        }

        return agg;
      });

      return Right(mapped);
    } catch (err) {
      this.logger.warn({ err });
      return Left(
        new UncaughtException(
          `${AnnotationRepositoryPostgres.name} uncaught exception`,
        ),
      );
    }
  }
}
