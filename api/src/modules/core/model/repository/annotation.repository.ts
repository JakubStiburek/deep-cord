import { Sql } from 'postgres';
import { AnnotationAggregate } from '../aggregate/annotation.aggregate';
import { AudioFile } from '../entity/audio-file.entity';
import { UncaughtException } from '../exception/uncaught.exception';
import { AnnotationSpan } from '../value-object/annotation-span.vo';
import { AnnotationType } from '../value-object/annotation-type.vo';
import { InvariantViolationException } from '../exception/invariant-violation.exception';

export interface AnnotationRepository {
  add(
    file: AudioFile,
    span: AnnotationSpan,
    type: AnnotationType,
    value: string | number,
    sql: Sql,
  ): Promise<
    AnnotationAggregate | UncaughtException | InvariantViolationException
  >;

  addBatch(
    file: AudioFile,
    annotations: {
      span: AnnotationSpan;
      type: AnnotationType;
      value: string | number;
    }[],
    sql: Sql,
  ): Promise<void | UncaughtException | InvariantViolationException>;

  getAnnotationsForRecord(
    file: AudioFile,
    sql: Sql,
  ): Promise<AnnotationAggregate[] | UncaughtException>;
}

export const AnnotationRepositorySymbol = Symbol('AnnotationRepository');
