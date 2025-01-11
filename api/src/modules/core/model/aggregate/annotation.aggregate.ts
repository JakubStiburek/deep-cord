import { z } from 'zod';
import { AnnotationEntitySchema } from '../entity/annotation.entity';
import { AudioFileEntitySchema } from '../entity/audio-file.entity';

export const AnnotationAggregateSchema = z.object({
  /** Root entity */
  annotation: AnnotationEntitySchema,
  file: AudioFileEntitySchema,
});

export type AnnotationAggregate = z.infer<typeof AnnotationAggregateSchema>;
