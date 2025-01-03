import { ApiProperty } from '@nestjs/swagger';

export class AnnotationSpanDto {
  @ApiProperty({
    example: 15.55,
  })
  readonly start: number;

  @ApiProperty({
    example: 16.75,
  })
  readonly end: number;
}
