import { v4 as uuid } from 'uuid';
import { Annotation } from '../entity/annotation.entity';
import { getAnnotationParams } from '../entity/annotation.entity.spec';
import { AudioFile } from '../entity/audio-file.entity';
import { DateTime } from 'luxon';
import { validateSync } from 'class-validator';
import { AnnotationAggregate } from './annotation.aggregate';

describe('(unit) AnnotationAggregate', () => {
  it('should create and validate instance', () => {
    const { id, span, type, value } = getAnnotationParams();
    const annotation = new Annotation(id, span, type, value);
    const file = new AudioFile(
      uuid(),
      'file-name',
      './uploads/file-name-2000-01-01.mp3',
      DateTime.now(),
      true,
    );
    const aggregate = new AnnotationAggregate(annotation, file);
    expect(validateSync(aggregate).length).toBe(0);
  });
});
