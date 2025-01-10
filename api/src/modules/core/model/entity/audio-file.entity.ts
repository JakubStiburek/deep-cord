import {
  IsBoolean,
  IsJSON,
  IsNotEmpty,
  IsString,
  IsUUID,
  Validate,
} from 'class-validator';
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

  @IsBoolean()
  transcribed: boolean;

  constructor(
    id: string,
    name: string,
    uri: string,
    createdAt: DateTime,
    transcribed: boolean,
  ) {
    this.id = id;
    this.name = name;
    this.uri = uri;
    this.createdAt = createdAt;
    this.transcribed = transcribed;
  }

  transcribe() {
    this.transcribed = true;
  }
}
