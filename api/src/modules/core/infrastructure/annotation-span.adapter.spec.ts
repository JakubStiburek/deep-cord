import { AnnotationSpan } from '../model/value-object/annotation-span.vo';
import { AnnotationSpanAdapter } from './annotation-span.adapter';

describe('(unit) AnnotationSpanAdapter', () => {
  const span = new AnnotationSpan(60, 65);
  it('should convert AnnotationSpan to miliseconds', () => {
    expect(AnnotationSpanAdapter.fromAnnotationSpan(span)).toStrictEqual({
      startTime: 60 * 1000,
      endTime: 65 * 1000,
    });
  });

  it('should convert miliseconds to AnnotationSpan', () => {
    expect(AnnotationSpanAdapter.fromMiliseconds(60000, 65000)).toStrictEqual(
      span,
    );
  });

  it('should convert AnnotationSpan to miliseconds rounding up decimals', () => {
    expect(
      AnnotationSpanAdapter.fromAnnotationSpan(
        new AnnotationSpan(0.1234561, 100.1234561),
      ),
    ).toStrictEqual({
      startTime: 123,
      endTime: 100123,
    });
  });

  it('should convet miliseconds to AnnotationSpan with fractions of miliseconds', () => {
    expect(
      AnnotationSpanAdapter.fromMiliseconds(20235588, 20240588),
    ).toStrictEqual(new AnnotationSpan(20235588 / 1000, 20240588 / 1000));
  });
});
