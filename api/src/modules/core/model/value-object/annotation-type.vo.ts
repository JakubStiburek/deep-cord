import { IsEnum, IsNotEmpty } from 'class-validator';

export enum AnnotationTypeEnum {
  TRANSCRIPT = 'transcript',
  CONFIDENCE = 'confidence',
  SPEAKER = 'speaker',
}

export class AnnotationType {
  @IsEnum(AnnotationTypeEnum)
  readonly type: AnnotationTypeEnum;

  constructor(type: AnnotationTypeEnum) {
    this.type = type;
  }
}
