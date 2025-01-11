import { createClient } from '@deepgram/sdk';
import { Inject } from '@nestjs/common';
import * as fs from 'fs';
import { Sql } from 'postgres';
import { AnnotationTypeEnum } from '../model/enum/annotation-type.enum';
import { AnnotationAggregateRepositoryPostgres } from '../infrastructure/annotation-aggregate-repository-postgres.implementation';
import { AudioFileEntityRepositoryPostgres } from '../infrastructure/audio-file-entity-repository-postgres.implementation';
import { AnnotationAggregateRepository } from '../model/repository/annotation-aggregate.repository';
import { AudioFileEntityRepository } from '../model/repository/audio-file-entity.repository';
import { AudioFileEntity, transcribe } from '../model/entity/audio-file.entity';

export class TranscriptService {
  constructor(
    @Inject('DEEPGRAM_API_KEY') private readonly apiKey: string,
    @Inject('POSTGRES_CLIENT')
    private readonly sql: Sql,
    @Inject(AnnotationAggregateRepositoryPostgres)
    private readonly annotationRepository: AnnotationAggregateRepository,

    @Inject(AudioFileEntityRepositoryPostgres)
    private readonly fileRepository: AudioFileEntityRepository,
  ) {}

  private async transcribeLocalFile(file: AudioFileEntity) {
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

      const transcription = await this.transcribeLocalFile(file);
      const words = transcription.results.channels[0].alternatives[0].words;
      const transcriptBatch = words.map((word) => {
        return {
          span: { start: word.start, end: word.end },
          type: { value: AnnotationTypeEnum.TRANSCRIPT },
          value: word.word,
        };
      });
      const confidenceBatch = words.map((word) => {
        return {
          span: { start: word.start, end: word.end },
          type: { value: AnnotationTypeEnum.CONFIDENCE },
          value: word.confidence,
        };
      });

      await this.annotationRepository.addBatch(
        file,
        [...transcriptBatch, ...confidenceBatch],
        sql,
      );

      const fileUpdateResult = await this.fileRepository.update(
        transcribe(file),
        sql,
      );

      if (fileUpdateResult instanceof Error) {
        throw fileUpdateResult;
      }
    });
  }
}
