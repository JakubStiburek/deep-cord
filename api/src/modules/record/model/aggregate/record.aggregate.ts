import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AudioFile } from '../entity/audio-file.entity';
import { AnnotationTypeEnum } from '../value-object/annotation-type.vo';
import { Annotation } from '../entity/annotation.entity';
import { Type } from 'class-transformer';

class AnnotationTier {
  @IsEnum(AnnotationTypeEnum)
  type: AnnotationTypeEnum;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => Annotation)
  annotations: Annotation[];

  constructor(type: AnnotationTypeEnum, annotations: Annotation[]) {
    this.type = type;
    this.annotations = annotations;
  }
}

export class Record {
  /** Aggregate root */
  @ValidateNested()
  readonly file: AudioFile;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnnotationTier)
  readonly annotationTiers: AnnotationTier[];

  @IsString()
  @IsOptional()
  readonly label?: string;

  constructor(file: AudioFile, annotations: Annotation[][], label?: string) {
    this.file = file;
    this.label = label;

    this.annotationTiers = annotations.map(
      (tier) => new AnnotationTier(tier[0].type.type, tier),
    );
  }
}
