import { ConflictException } from '@nestjs/common';

export class SpeakerNotUniqueException extends ConflictException {
  constructor() {
    super('Speaker with that name is already used for this record');
  }
}
