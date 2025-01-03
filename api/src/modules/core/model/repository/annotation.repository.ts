import { Sql } from 'postgres';
import { AnnotationAggregate } from '../aggregate/annotation.aggregate';
import { AudioFile } from '../entity/audio-file.entity';
import { UncaughtException } from '../exception/uncaught.exception';
import { AnnotationSpan } from '../value-object/annotation-span.vo';
import { AnnotationType } from '../value-object/annotation-type.vo';
import { Either } from 'purify-ts';
import { InvariantViolationException } from '../exception/invariant-violation.exception';

export interface AnnotationRepository {
  add(
    file: AudioFile,
    span: AnnotationSpan,
    type: AnnotationType,
    value: string | number,
    sql: Sql,
  ): Promise<
    Either<UncaughtException | InvariantViolationException, AnnotationAggregate>
  >;
}

export const AnnotationRepositorySymbol = Symbol('AnnotationRepository');
