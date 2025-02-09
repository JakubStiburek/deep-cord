import { v4 as uuid } from 'uuid';
import { AnnotationAggregateSchema } from './annotation.aggregate';
import { AnnotationTypeEnum } from '../enum/annotation-type.enum';
import { DateTime } from 'luxon';

describe('(unit) AnnotationAggregate', () => {
  it('should create and validate instance', () => {
    expect(
      AnnotationAggregateSchema.safeParse({
        annotation: {
          id: uuid(),
          span: {
            start: 1,
            end: 1.5,
          },
          type: {
            value: AnnotationTypeEnum.TRANSCRIPT,
          },
          value: 'word',
          confidence: 0.5,
        },
        file: {
          id: uuid(),
          name: 'name',
          uri: './uploads/name',
          createdAt: DateTime.now(),
          transcribed: true,
        },
      }).success,
    ).toBeTruthy();
  });
});
