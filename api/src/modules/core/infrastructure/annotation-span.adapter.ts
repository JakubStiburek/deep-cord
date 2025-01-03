import { AnnotationSpan } from '../model/value-object/annotation-span.vo';

export class AnnotationSpanAdapter {
  static fromAnnotationSpan(span: AnnotationSpan) {
    return {
      startTime: Number((span.start * 1000).toFixed(3)),
      endTime: Number((span.end * 1000).toFixed(3)),
    };
  }

  static fromMiliseconds(startTime: number, endTime: number) {
    return new AnnotationSpan(startTime / 1000, endTime / 1000);
  }
}
