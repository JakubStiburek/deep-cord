import { v4 as uuid } from 'uuid';
import { DateTime } from 'luxon';
import {
  AudioFileEntitySchema,
  transcribe,
} from '../model/entity/audio-file.entity';

describe('(unit) File', () => {
  it.each([
    {
      id: uuid(),
      name: 'my-file',
      uri: './uplads',
      createdAt: DateTime.now(),
      success: true,
    },
    {
      id: uuid(),
      name: 'my-file',
      uri: '',
      createdAt: DateTime.now(),
      success: false,
    },
    {
      id: uuid(),
      name: 'my-file',
      uri: './uplads',
      createdAt: DateTime.fromISO('thisisnotiso'),
      success: false,
    },
  ])(
    'should create and validate instance',
    ({ id, name, uri, createdAt, success }) => {
      expect(
        AudioFileEntitySchema.safeParse({
          id,
          name,
          uri,
          createdAt,
          transcribed: true,
        }).success,
      ).toBe(success);
    },
  );

  it('should update file to transcribed', () => {
    const file = {
      id: uuid(),
      name: 'name',
      uri: './uploads/name',
      createdAt: DateTime.now(),
      transcribed: false,
    };

    expect(AudioFileEntitySchema.safeParse(file).success).toBeTruthy();

    const transcribedFile = transcribe(file);

    expect(
      AudioFileEntitySchema.safeParse(transcribedFile).success,
    ).toBeTruthy();
    expect(transcribedFile.transcribed).toBeTruthy();
  });

  // it('should update file to transcribed', () => {
  //   const file = new AudioFile(
  //     uuid(),
  //     'name',
  //     './uploads/name',
  //     DateTime.now(),
  //     false,
  //   );
  //   expect(file.transcribed).toBeFalsy();
  //   file.transcribe();
  //   expect(file.transcribed).toBeTruthy();
  // });
});
