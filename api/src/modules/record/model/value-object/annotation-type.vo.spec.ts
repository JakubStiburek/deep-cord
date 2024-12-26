import { validateSync } from 'class-validator';
import { AnnotationType, AnnotationTypeEnum } from './annotation-type.vo';

describe('(unit) AnnotationType', () => {
  it.each([
    [AnnotationTypeEnum.TRANSCRIPT, 0],
    [AnnotationTypeEnum.CONFIDENCE, 0],
    [AnnotationTypeEnum.SPEAKER, 0],
    ['invalid', 1],
    [undefined, 1],
  ])('should create and validate instance', (type, errors) => {
    expect(
      validateSync(new AnnotationType(type as AnnotationTypeEnum)).length,
    ).toBe(errors);
  });
});
