import { createClient } from '@deepgram/sdk';
import { Inject, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import { AudioFile } from '../model/entity/audio-file.entity';
import { Sql } from 'postgres';
import {
  AudioFileRepositorySymbol,
  AudioFileRepository,
} from '../model/repository/audio-file.repository';
import { error } from 'console';
import {
  AnnotationRepositorySymbol,
  AnnotationRepository,
} from '../model/repository/annotation.repository';
import { AnnotationSpan } from '../model/value-object/annotation-span.vo';
import {
  AnnotationType,
  AnnotationTypeEnum,
} from '../model/value-object/annotation-type.vo';

export class TranscriptService {
  constructor(
    @Inject('DEEPGRAM_API_KEY') private readonly apiKey: string,
    @Inject('POSTGRES_CLIENT')
    private readonly sql: Sql,
    @Inject(AudioFileRepositorySymbol)
    private readonly repository: AudioFileRepository,
    @Inject(AnnotationRepositorySymbol)
    private readonly annotationRepository: AnnotationRepository,
  ) {}

  private async transcribeLocalFile(file: AudioFile) {
    const deepgram = createClient(this.apiKey);

    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      fs.readFileSync(file.uri),
      { smart_format: true, model: 'nova-2', detect_language: true },
    );

    if (error) throw error;
    return result;
  }

  async transcribe(id: string) {
    return this.sql.begin(async (sql) => {
      const file = await this.repository.getById(id, this.sql);

      if (file instanceof Error) {
        return file;
      }

      const transcription = await this.transcribeLocalFile(file);
      const words = transcription.results.channels[0].alternatives[0].words;
      const result = await Promise.all(
        words.map((word) =>
          this.annotationRepository.add(
            file,
            new AnnotationSpan(word.start, word.end),
            new AnnotationType(AnnotationTypeEnum.TRANSCRIPT),
            word.word,
            sql,
          ),
        ),
      );

      if (result[0] instanceof Error) {
        throw result[0];
      }
    });
  }
}
