import { v4 as uuid } from 'uuid';
import { validateSync } from 'class-validator';
import { AudioFile } from '../entity/audio-file.entity';
import { Record } from './record.aggregate';
import { Annotation } from '../entity/annotation.entity';
import { AnnotationSpan } from '../value-object/annotation-span.vo';
import {
  AnnotationType,
  AnnotationTypeEnum,
} from '../value-object/annotation-type.vo';

describe('(unit) RecordAggregate', () => {
  it('should create valid instance', () => {
    const record = new Record(
      new AudioFile(uuid(), './path/to/file'),
      [
        [
          new Annotation(
            uuid(),
            new AnnotationSpan(1, 5),
            new AnnotationType(AnnotationTypeEnum.TRANSCRIPT),
            'word',
          ),
        ],
      ],
      'The Alpha project - record 1',
    );

    expect(record).toBeDefined();
    expect(validateSync(record).length).toBe(0);
  });

  it('should reject invalid input', () => {
    const record = new Record(
      new AudioFile(uuid(), './path/to/file'),
      [
        [
          new Annotation(
            uuid(),
            new AnnotationSpan(1, 5),
            new AnnotationType(AnnotationTypeEnum.TRANSCRIPT),
            50,
          ),
        ],
      ],
      'The Alpha project - record 1',
    );

    expect(record).toBeDefined();
    expect(validateSync(record).length).toBe(1);
  });
});
