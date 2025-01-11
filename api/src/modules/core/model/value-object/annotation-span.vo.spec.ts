import { AnnotationSpanVOSchema } from './annotation-span.vo';

describe('(unit) AnnotationSpan', () => {
  it.each([
    [-1, 1, false],
    [1, -5, false],
    [undefined, undefined, false],
    [3, 1, false],
    [1, 5, true],
    [1.5, 3.65, true],
  ])(
    'should create and validate instance (case: %#)',
    (start, end, success) => {
      expect(AnnotationSpanVOSchema.safeParse({ start, end }).success).toBe(
        success,
      );
    },
  );
});
