import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AnnotationTypeEnum } from '../../model/value-object/annotation-type.vo';
import { AnnotationSpanDto } from './annotation-span.dto';

type Value = string | number;

export class CreateAnnotationDto {
  @ApiProperty({
    description: 'Seconds',
  })
  readonly span!: AnnotationSpanDto;

  @ApiProperty({
    enum: AnnotationTypeEnum,
    example: AnnotationTypeEnum.TRANSCRIPT,
  })
  readonly type!: AnnotationTypeEnum;

  @ApiProperty({
    example: 'word',
  })
  readonly value!: Value;
}
