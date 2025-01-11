import { AnnotationSpanVO } from '../model-zod/value-object/annotation-span.vo';
import { AnnotationSpan } from '../model/value-object/annotation-span.vo';

export class AnnotationSpanAdapter {
  static fromAnnotationSpan(span: AnnotationSpan) {
    return {
      startTime: Math.floor(Number(span.start * 1000)),
      endTime: Math.floor(Number(span.end * 1000)),
    };
  }

  static fromMiliseconds(startTime: number, endTime: number) {
    return new AnnotationSpan(startTime / 1000, endTime / 1000);
  }
}

export function convertToMilis(span: AnnotationSpanVO) {
  return {
    start_time: Math.floor(Number(span.start * 1000)),
    end_time: Math.floor(Number(span.end * 1000)),
  };
}
export function convertToAnnotationSpanVo(
  start_time: number,
  end_time: number,
) {
  return {
    start: start_time / 1000,
    end: end_time / 1000,
  };
}
