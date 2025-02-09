import { ApiProperty } from '@nestjs/swagger';
import { SpeakerVO } from '../../model/value-object/speaker.vo';

export class SpeakerListDto {
  @ApiProperty({
    isArray: true,
    example: ['John', 'Bart'],
  })
  readonly speakers: string[];

  constructor(speakers: string[]) {
    this.speakers = speakers;
  }

  static fromDomain(valueObjects: SpeakerVO[]) {
    return new SpeakerListDto(valueObjects.map(({ value }) => value));
  }
}
