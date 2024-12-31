import { ApiProperty } from '@nestjs/swagger';
import { DateTime } from 'luxon';
import { Valid } from 'luxon/src/_util';

export class FileDto {
  @ApiProperty({
    example: '4b61aa1d-4c42-4e60-b8f5-04735e8b6999',
  })
  readonly id: string;

  @ApiProperty({
    example: 'my-audio-file.mp3',
  })
  readonly name: string;

  @ApiProperty({
    example: './uploads/record-original-file-name-2024-12-24.mp4',
  })
  readonly uri: string;

  @ApiProperty({
    example: DateTime.now().toISO(),
  })
  readonly createdAt: string;

  constructor(
    id: string,
    name: string,
    uri: string,
    createdAt: DateTime<Valid>,
  ) {
    this.id = id;
    this.uri = uri;
    this.name = name;
    this.createdAt = createdAt.toISO();
  }
}
