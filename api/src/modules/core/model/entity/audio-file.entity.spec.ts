import { validateSync } from 'class-validator';
import { v4 as uuid } from 'uuid';
import { AudioFile } from './audio-file.entity';
import { DateTime } from 'luxon';

describe('(unit) File', () => {
  it.each([
    {
      id: uuid(),
      name: 'my-file',
      uri: './uplads',
      createdAt: DateTime.now(),
      errors: 0,
    },
    {
      id: uuid(),
      name: 'my-file',
      uri: '',
      createdAt: DateTime.now(),
      errors: 1,
    },
    {
      id: uuid(),
      name: 'my-file',
      uri: './uplads',
      createdAt: DateTime.fromISO('thisisnotiso'),
      errors: 1,
    },
  ])(
    'should create and validate instance',
    ({ id, name, uri, createdAt, errors }) => {
      expect(validateSync(new AudioFile(id, name, uri, createdAt)).length).toBe(
        errors,
      );
    },
  );
});
