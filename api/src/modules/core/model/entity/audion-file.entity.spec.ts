import { validateSync } from 'class-validator';
import { v4 as uuid } from 'uuid';
import { AudioFile } from './audio-file.entity';

describe('(unit) File', () => {
  it.each([
    [uuid(), './uploads/audio-file.mp3', 0],
    [uuid(), '', 1],
  ])('should create and validate instance', (id, uri, errors) => {
    expect(validateSync(new AudioFile(id, uri)).length).toBe(errors);
  });
});
