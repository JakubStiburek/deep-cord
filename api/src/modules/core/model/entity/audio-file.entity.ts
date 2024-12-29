import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AudioFile {
  @IsUUID('4')
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  readonly uri: string;

  constructor(id: string, uri: string) {
    this.id = id;
    this.uri = uri;
  }
}
