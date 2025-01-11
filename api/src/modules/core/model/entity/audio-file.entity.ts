import { DateTime } from 'luxon';
import { Valid } from 'luxon/src/_util';
import { z } from 'zod';

export const AudioFileEntitySchema = z.object({
  id: z.string().uuid(),
  name: z.string().nonempty(),
  uri: z.string().nonempty(),
  createdAt: z.custom<DateTime<Valid>>((value: DateTime) => value.isValid),
  transcribed: z.boolean(),
});

export type AudioFileEntity = z.infer<typeof AudioFileEntitySchema>;

export function transcribe(audioFile: AudioFileEntity) {
  return { ...audioFile, transcribed: true };
}
