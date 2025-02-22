import { AnnotationTypeEnum } from '../enum/annotation-type.enum';
import { AnnotationTypeVOSchema } from './annotation-type.vo';

describe('(unit) AnnotationType', () => {
  it.each([
    [AnnotationTypeEnum.TRANSCRIPT, true],
    [AnnotationTypeEnum.SPEAKER, true],
    [AnnotationTypeEnum.NOTE, true],
    ['invalid', false],
    [undefined, false],
  ])('should create and validate instance', (value, success) => {
    expect(AnnotationTypeVOSchema.safeParse({ value }).success).toBe(success);
  });
});
