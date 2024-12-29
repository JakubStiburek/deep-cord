import { ApiProperty } from '@nestjs/swagger';
import { file } from 'mock-fs/lib/filesystem';

class FileDto {
  @ApiProperty({
    example: './uploads/record-oritginal-file-name-2024-12-24.mp4',
  })
  readonly uri: string;

  constructor(filename: string, scheme: string) {
    this.uri = scheme + '/' + filename;
  }
}

export class ListUploadedFilesResponseDto {
  @ApiProperty({
    type: FileDto,
    isArray: true,
    description: 'List of uploaded files.',
  })
  readonly files: FileDto[];

  constructor(files: string[], scheme?: string) {
    if (!scheme) {
      this.files = [];
    }
    this.files = files.map((filename) => new FileDto(filename, scheme));
  }
}
