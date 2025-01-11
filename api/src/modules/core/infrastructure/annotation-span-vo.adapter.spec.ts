import {
  convertToMilis,
  convertToAnnotationSpanVo,
} from './annotation-span.adapter';

describe('(unit) AnnotationSpanAdapter', () => {
  const span = { start: 60, end: 65 };
  it('should convert AnnotationSpan to miliseconds', () => {
    expect(convertToMilis(span)).toStrictEqual({
      start_time: 60 * 1000,
      end_time: 65 * 1000,
    });
  });

  it('should convert miliseconds to AnnotationSpan', () => {
    expect(convertToAnnotationSpanVo(60000, 65000)).toStrictEqual(span);
  });

  it('should convert AnnotationSpan to miliseconds rounding up decimals', () => {
    expect(
      convertToMilis({ start: 0.1234561, end: 100.1234561 }),
    ).toStrictEqual({
      start_time: 123,
      end_time: 100123,
    });
  });

  it('should convet miliseconds to AnnotationSpan with fractions of miliseconds', () => {
    expect(convertToAnnotationSpanVo(20235588, 20240588)).toStrictEqual({
      start: 20235588 / 1000,
      end: 20240588 / 1000,
    });
  });
});
