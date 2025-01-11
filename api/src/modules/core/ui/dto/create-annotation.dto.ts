import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AnnotationSpanDto } from './annotation-span.dto';
import { AnnotationTypeEnum } from '../../model/enum/annotation-type.enum';

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
