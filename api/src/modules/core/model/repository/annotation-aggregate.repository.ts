import { Sql } from 'postgres';
import { AnnotationAggregate } from '../aggregate/annotation.aggregate';
import { AudioFileEntity } from '../entity/audio-file.entity';
import { AnnotationSpanVO } from '../value-object/annotation-span.vo';
import { AnnotationTypeVO } from '../value-object/annotation-type.vo';

export interface AnnotationAggregateRepository {
  getById(
    id: string,
    file: AudioFileEntity,
    sql: Sql,
  ): Promise<AnnotationAggregate>;

  add(
    file: AudioFileEntity,
    span: AnnotationSpanVO,
    type: AnnotationTypeVO,
    value: string | number,
    sql: Sql,
    id?: string,
  ): Promise<AnnotationAggregate>;

  save(aggregate: AnnotationAggregate, sql: Sql): Promise<AnnotationAggregate>;

  addBatch(
    file: AudioFileEntity,
    annotations: {
      span: AnnotationSpanVO;
      type: AnnotationTypeVO;
      value: string | number;
    }[],
    sql: Sql,
  ): Promise<void>;

  getAnnotationsForRecord(
    file: AudioFileEntity,
    sql: Sql,
  ): Promise<AnnotationAggregate[]>;
}
