import { ApiProperty } from '@nestjs/swagger';
import { AnnotationSpanDto } from './annotation-span.dto';

type Value = string | number;

export class UpdateAnnotationDto {
  @ApiProperty({
    description: 'Seconds',
  })
  readonly span!: AnnotationSpanDto;

  @ApiProperty({
    example: 'word',
  })
  readonly value!: Value;
}
