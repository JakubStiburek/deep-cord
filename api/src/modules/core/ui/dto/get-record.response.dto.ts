import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FileDto } from './file.dto';
import { AnnotationDto } from './annotation.dto';

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
