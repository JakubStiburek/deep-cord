import { ApiProperty } from '@nestjs/swagger';
import { AnnotationTypeEnum } from '../../model/enum/annotation-type.enum';
import { AnnotationSpanDto } from './annotation-span.dto';
import { AnnotationEntity } from '../../model/entity/annotation.entity';

type Value = string | number;

export class AnnotationDto {
  @ApiProperty({
    example: '1696f02e-d3a8-4084-bc32-b76738afefeb',
  })
  readonly id!: string;

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

  static fromEntity(entity: AnnotationEntity): AnnotationDto {
    return {
      id: entity.id,
      span: {
        start: entity.span.start,
        end: entity.span.end,
      },
      type: entity.type.value,
      value: entity.value,
    };
  }
}
