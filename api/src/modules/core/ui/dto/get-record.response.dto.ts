import { ApiProperty } from '@nestjs/swagger';
import { FileDto } from './file.dto';
import { AnnotationDto } from './annotation.dto';
import { AnnotationTypeEnum } from '../../model/enum/annotation-type.enum';

class AnnotationTierDto {
  @ApiProperty({
    isArray: true,
    type: AnnotationDto,
  })
  readonly annotations!: AnnotationDto[];

  @ApiProperty()
  readonly type!: AnnotationTypeEnum;
}

export class GetRecordResponseDto {
  @ApiProperty({
    example: '1696f02e-d3a8-4084-bc32-b76738afefeb',
  })
  readonly id!: string;

  @ApiProperty()
  readonly file: FileDto;

  @ApiProperty({
    isArray: true,
    type: AnnotationTierDto,
  })
  readonly annotationTiers: AnnotationTierDto[];

  constructor(file: FileDto, annotations: AnnotationDto[]) {
    this.file = file;
    this.annotationTiers = Object.values(
      annotations.reduce((acc: AnnotationDto[][], item) => {
        if (!acc[item.type]) {
          acc[item.type] = [];
        }
        acc[item.type].push(item);
        return acc;
      }, []),
    ).map((annotations) => ({
      annotations,
      type: annotations[0].type,
    }));
  }
}
