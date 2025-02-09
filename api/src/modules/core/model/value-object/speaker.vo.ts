import { z } from 'zod';

export const SpeakerVOSchema = z.object({
  value: z.string().min(1).max(100),
});

export type SpeakerVO = z.infer<typeof SpeakerVOSchema>;
