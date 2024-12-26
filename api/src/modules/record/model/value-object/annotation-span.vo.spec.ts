import { validateSync } from 'class-validator';
import { AnnotationSpan } from './annotation-span.vo';

describe('(unit) AnnotationSpan', () => {
  it.each([
    [-1, 1, 1],
    [1, -5, 1],
    [undefined, undefined, 2],
    [1, 5, 0],
  ])('should create and validate instance', (start, end, errors) => {
    expect(validateSync(new AnnotationSpan(start, end)).length).toBe(errors);
  });
});
