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
    private readonly fileRepository: AudioFileRepository,
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
      const file = await this.fileRepository.getById(id, this.sql);

      if (file instanceof Error) {
        return file;
      }

      if (file.transcribed) {
        return;
      }

      const transcription = await this.transcribeLocalFile(file);
      const words = transcription.results.channels[0].alternatives[0].words;
      const transcriptBatch = words.map((word) => {
        return {
          span: new AnnotationSpan(word.start, word.end),
          type: new AnnotationType(AnnotationTypeEnum.TRANSCRIPT),
          value: word.word,
        };
      });
      const confidenceBatch = words.map((word) => {
        return {
          span: new AnnotationSpan(word.start, word.end),
          type: new AnnotationType(AnnotationTypeEnum.CONFIDENCE),
          value: word.confidence,
        };
      });

      const result = await this.annotationRepository.addBatch(
        file,
        [...transcriptBatch, ...confidenceBatch],
        sql,
      );

      if (result instanceof Error) {
        throw result;
      }

      file.transcribe();

      const fileUpdateResult = await this.fileRepository.update(file, sql);

      if (fileUpdateResult instanceof Error) {
        throw fileUpdateResult;
      }
    });
  }
}
