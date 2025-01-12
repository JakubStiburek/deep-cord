import { ApiProperty } from '@nestjs/swagger';
import { FileDto } from './file.dto';

export class ListUploadedFilesResponseDto {
  @ApiProperty({
    type: FileDto,
    isArray: true,
    description: 'List of uploaded files.',
  })
  readonly files: FileDto[];

  constructor(files: FileDto[]) {
    this.files = files;
  }
}
