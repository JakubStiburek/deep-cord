import { validateSync } from 'class-validator';
import { v4 as uuid } from 'uuid';
import { Annotation } from './annotation.entity';
import { AnnotationSpan } from '../value-object/annotation-span.vo';
import {
  AnnotationType,
  AnnotationTypeEnum,
} from '../value-object/annotation-type.vo';

export function getAnnotationParams(override?: {
  id?: string;
  span?: AnnotationSpan;
  type?: AnnotationType;
  value?: string | number;
}) {
  return {
    id: uuid(),
    span: new AnnotationSpan(1, 5),
    type: new AnnotationType(AnnotationTypeEnum.TRANSCRIPT),
    value: 'word',
    ...override,
  };
}

describe('(unit) Annotation', () => {
  it.each([
    { params: getAnnotationParams(), errors: 0 },
    { params: getAnnotationParams({ id: undefined }), errors: 1 },
    { params: getAnnotationParams({ id: '' }), errors: 1 },
    { params: getAnnotationParams({ id: 'invalid' }), errors: 1 },
    {
      params: getAnnotationParams({ span: new AnnotationSpan(-1, 5) }),
      errors: 1,
    },
    {
      params: getAnnotationParams({
        type: new AnnotationType('invalid' as AnnotationTypeEnum),
      }),
      errors: 2,
    },
    {
      params: getAnnotationParams({
        type: new AnnotationType(AnnotationTypeEnum.TRANSCRIPT),
        value: 1,
      }),
      errors: 1,
    },
    {
      params: getAnnotationParams({
        type: new AnnotationType(AnnotationTypeEnum.SPEAKER),
        value: 1,
      }),
      errors: 1,
    },
    {
      params: getAnnotationParams({
        type: new AnnotationType(AnnotationTypeEnum.CONFIDENCE),
        value: 'word',
      }),
      errors: 1,
    },
  ])('should create and validate instance', ({ params, errors }) => {
    expect(
      validateSync(
        new Annotation(params.id, params.span, params.type, params.value),
      ).length,
    ).toBe(errors);
  });
});
