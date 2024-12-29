import { validateSync } from 'class-validator';
import { v4 as uuid } from 'uuid';
import { Annotation } from './annotation.entity';
import { AnnotationSpan } from '../value-object/annotation-span.vo';
import {
  AnnotationType,
  AnnotationTypeEnum,
} from '../value-object/annotation-type.vo';

function getParams(override?: {
  id?: string;
  span?: AnnotationSpan;
  type?: AnnotationType;
  value?: string | number;
  meta?: any;
}) {
  return {
    id: uuid(),
    span: new AnnotationSpan(1, 5),
    type: new AnnotationType(AnnotationTypeEnum.TRANSCRIPT),
    value: 'word',
    meta: undefined,
    ...override,
  };
}

describe('(unit) Annotation', () => {
  it.each([
    { params: getParams(), errors: 0 },
    { params: getParams({ id: undefined }), errors: 1 },
    { params: getParams({ id: '' }), errors: 1 },
    { params: getParams({ id: 'invalid' }), errors: 1 },
    { params: getParams({ span: new AnnotationSpan(-1, 5) }), errors: 1 },
    {
      params: getParams({
        type: new AnnotationType('invalid' as AnnotationTypeEnum),
      }),
      errors: 2,
    },
    {
      params: getParams({
        type: new AnnotationType(AnnotationTypeEnum.TRANSCRIPT),
        value: 1,
      }),
      errors: 1,
    },
    {
      params: getParams({
        type: new AnnotationType(AnnotationTypeEnum.SPEAKER),
        value: 1,
      }),
      errors: 1,
    },
    {
      params: getParams({
        type: new AnnotationType(AnnotationTypeEnum.CONFIDENCE),
        value: 'word',
      }),
      errors: 1,
    },
  ])('should create and validate instance', ({ params, errors }) => {
    expect(
      validateSync(
        new Annotation(
          params.id,
          params.span,
          params.type,
          params.value,
          params.meta,
        ),
      ).length,
    ).toBe(errors);
  });
});
