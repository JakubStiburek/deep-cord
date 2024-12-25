import { ApiProperty } from '@nestjs/swagger';

export class UploadAudioFileResponseDto {
  @ApiProperty({
    description: 'File location on the server.',
    example: './uploads/record-conversation-2024-01-21.mp3',
  })
  readonly path: string;

  constructor(path: string) {
    this.path = path;
  }
}
