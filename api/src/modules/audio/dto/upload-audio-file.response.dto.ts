import { ApiProperty } from '@nestjs/swagger';

export class UploadAudioFileResponseDto {
  @ApiProperty({
    description: 'File location on the server.',
    example: './uploads/record-conversation-2024-01-21.mp3',
  })
  readonly uri: string;

  constructor(uri: string) {
    this.uri = uri;
  }
}
