import { z } from 'zod';
import { AnnotationSpanVOSchema } from '../value-object/annotation-span.vo';
import { AnnotationTypeVOSchema } from '../value-object/annotation-type.vo';

export const AnnotationEntitySchema = z.object({
  id: z.string().uuid().nonempty(),
  span: AnnotationSpanVOSchema,
  type: AnnotationTypeVOSchema,
  value: z.string().nonempty(),
  confidence: z.number().min(0).max(1),
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
