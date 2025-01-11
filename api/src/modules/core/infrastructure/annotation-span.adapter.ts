import { AnnotationSpanVO } from '../model/value-object/annotation-span.vo';

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
