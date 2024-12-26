import { IsOptional, IsUUID, Validate, ValidateNested } from 'class-validator';
import { AnnotationSpan } from '../value-object/annotation-span.vo';
import { AnnotationType } from '../value-object/annotation-type.vo';
import { IsMatchingAnnotationType } from './validation/is-matching-annotation-type.decorator';

export class Annotation {
  @IsUUID('4')
  readonly id: string;

  @ValidateNested()
  readonly span: AnnotationSpan;

  @ValidateNested()
  readonly type: AnnotationType;

  @Validate(IsMatchingAnnotationType)
  readonly value: string | number;

  @IsOptional()
  readonly meta: any;

  constructor(
    id: string,
    span: AnnotationSpan,
    type: AnnotationType,
    value: string | number,
    meta?: any,
  ) {
    this.id = id;
    this.span = span;
    this.type = type;
    this.value = value;
    this.meta = meta;
  }
}
