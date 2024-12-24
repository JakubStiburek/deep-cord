import { ApiProperty } from '@nestjs/swagger';

export class ListUploadedFilesResponseDto {
  @ApiProperty({
    type: String,
    isArray: true,
    description: 'List of uploaded files.',
    example: [
      'record-original-file-name-2024-12-24.mp3',
      'record-oritginal-file-name-2024-12-24.mp4',
    ],
  })
  readonly files: string[];

  constructor(files: string[]) {
    this.files = files;
  }
}
