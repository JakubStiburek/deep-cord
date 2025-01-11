import { z } from 'zod';
import { AnnotationTypeEnum } from '../enum/annotation-type.enum';

export const AnnotationTypeVOSchema = z.object({
  value: z.nativeEnum(AnnotationTypeEnum),
});

export type AnnotationTypeVO = z.infer<typeof AnnotationTypeVOSchema>;
