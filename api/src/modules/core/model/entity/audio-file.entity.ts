import { IsNotEmpty, IsString, IsUUID, Validate } from 'class-validator';
import { DateTime } from 'luxon';
import { Valid } from 'luxon/src/_util';
import { IsValidDateTime } from './validation/is-valid-datetime.validator';

export class AudioFile {
  @IsUUID('4')
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly uri: string;

  @Validate(IsValidDateTime)
  readonly createdAt: DateTime<Valid>;

  constructor(id: string, name: string, uri: string, createdAt: DateTime) {
    this.id = id;
    this.name = name;
    this.uri = uri;
    this.createdAt = createdAt;
  }
}
