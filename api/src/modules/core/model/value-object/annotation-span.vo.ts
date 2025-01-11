import { z } from 'zod';

export const AnnotationSpanVOSchema = z
  .object({
    start: z.number().min(0),
    end: z.number().min(0),
  })
  .refine((data) => data.end > data.start);

export type AnnotationSpanVO = z.infer<typeof AnnotationSpanVOSchema>;
