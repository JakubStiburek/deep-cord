import { v4 as uuid } from 'uuid';
import { AnnotationTypeEnum } from '../enum/annotation-type.enum';
import { AnnotationSpanVO } from '../value-object/annotation-span.vo';
import { AnnotationTypeVO } from '../value-object/annotation-type.vo';
import {
  AnnotationEntitySchema,
  updateAnnotationSpan,
  updateAnnotationValue,
} from './annotation.entity';

export function getAnnotation(override?: {
  id?: string;
  span?: AnnotationSpanVO;
  type?: AnnotationTypeVO;
  value?: string;
  confidence?: number;
}) {
  return {
    id: uuid(),
    span: { start: 1, end: 2 },
    type: { value: AnnotationTypeEnum.TRANSCRIPT },
    value: 'word',
    confidence: 1,
    ...override,
  };
}

describe('(unit) Annotation', () => {
  it.each([
    { annotation: getAnnotation(), success: true },
    { annotation: getAnnotation({ id: undefined }), success: false },
    { annotation: getAnnotation({ id: '' }), success: false },
    { annotation: getAnnotation({ id: 'invalid' }), success: false },
    {
      annotation: getAnnotation({ span: { start: -1, end: 5 } }),
      success: false,
    },
    {
      annotation: getAnnotation({
        type: { value: 'invalid' as AnnotationTypeEnum },
      }),
      success: false,
    },
    {
      annotation: getAnnotation({
        type: { value: AnnotationTypeEnum.TRANSCRIPT },
        value: 1 as unknown as string,
      }),
      success: false,
    },
    {
      annotation: getAnnotation({
        type: { value: AnnotationTypeEnum.SPEAKER },
        value: 1 as unknown as string,
      }),
      success: false,
    },
  ])(
    'should create and validate instance (case %#)',
    ({ annotation, success }) => {
      expect(AnnotationEntitySchema.safeParse(annotation).success).toBe(
        success,
      );
    },
  );

  describe('(unit) update Annotation', () => {
    const original = getAnnotation();

    it('should update span', () => {
      expect(updateAnnotationSpan(original, 2, 3)).toBeDefined();
    });

    it('should fail to update span', () => {
      expect(() => updateAnnotationSpan(original, 3, 2)).toThrow();
    });

    it('should update value', () => {
      expect(updateAnnotationValue(original, 'new word')).toBeDefined();
    });

    it('should fail to update value', () => {
      expect(() => updateAnnotationValue(original, 15)).toThrow();
    });
  });
});
