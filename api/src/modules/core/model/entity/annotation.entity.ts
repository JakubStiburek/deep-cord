import { z } from 'zod';
import { AnnotationSpanVOSchema } from '../value-object/annotation-span.vo';
import { AnnotationTypeVOSchema } from '../value-object/annotation-type.vo';
import { AnnotationTypeEnum } from '../enum/annotation-type.enum';

export const AnnotationEntitySchema = z
  .object({
    id: z.string().uuid().nonempty(),
    span: AnnotationSpanVOSchema,
    type: AnnotationTypeVOSchema,
    value: z.string().nonempty().or(z.number()),
  })
  .refine((data) => {
    if (data.type.value === AnnotationTypeEnum.CONFIDENCE) {
      return typeof data.value === 'number';
    } else if (data.type.value === AnnotationTypeEnum.TRANSCRIPT) {
      return typeof data.value === 'string' && Number.isNaN(Number(data.value));
    } else {
      return typeof data.value === 'string';
    }
  });

export type AnnotationEntity = z.infer<typeof AnnotationEntitySchema>;

export function updateAnnotationSpan(
  annotation: AnnotationEntity,
  start: number,
  end: number,
) {
  return AnnotationEntitySchema.parse({
    ...annotation,
    span: {
      start,
      end,
    },
  });
}

export function updateAnnotationValue(
  annotation: AnnotationEntity,
  value: string | number,
) {
  return AnnotationEntitySchema.parse({
    ...annotation,
    value,
  });
}
