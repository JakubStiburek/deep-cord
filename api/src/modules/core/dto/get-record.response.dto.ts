import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AnnotationTypeEnum } from '../model/value-object/annotation-type.vo';
import { FileDto } from './file.dto';

type Value = string | number;

class AnnotationSpanDto {
  @ApiProperty({
    example: 15.55,
  })
  readonly start: number;

  @ApiProperty({
    example: 16.75,
  })
  readonly end: number;
}

class AnnotationDto {
  @ApiProperty({
    example: '1696f02e-d3a8-4084-bc32-b76738afefeb',
  })
  readonly id: string;

  @ApiProperty({
    description: 'Seconds',
  })
  readonly span: AnnotationSpanDto;

  @ApiProperty({
    enum: AnnotationTypeEnum,
    example: AnnotationTypeEnum.TRANSCRIPT,
  })
  readonly type: AnnotationTypeEnum;

  @ApiProperty({
    example: 'word',
  })
  readonly value: Value;

  @ApiPropertyOptional()
  readonly meta?: any;
}

class AnnotationTierDto {
  @ApiProperty({
    isArray: true,
    type: AnnotationDto,
  })
  readonly annotations: AnnotationDto[];
}

export class GetRecordResponseDto {
  @ApiProperty({
    example: '1696f02e-d3a8-4084-bc32-b76738afefeb',
  })
  readonly id: string;

  @ApiProperty()
  readonly file: FileDto;

  @ApiProperty({
    isArray: true,
    type: AnnotationTierDto,
  })
  readonly annotationTiers: AnnotationTierDto[];

  @ApiPropertyOptional({
    description: 'Optional name for the record',
    example: 'My first record',
  })
  readonly label?: string;
}
