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

export class TranscriptService {
  constructor(
    @Inject('DEEPGRAM_API_KEY') private readonly apiKey: string,
    @Inject('POSTGRES_CLIENT')
    private readonly sql: Sql,
    @Inject(AudioFileRepositorySymbol)
    private readonly repository: AudioFileRepository,
  ) {}

  private async transcribeLocalFile(file: AudioFile) {
    const deepgram = createClient(this.apiKey);

    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      fs.readFileSync(file.uri),
      { smart_format: true, model: 'nova-2', detect_language: true },
    );

    if (error) throw error;
    if (!error) console.dir(result, { depth: null });
    return result;
  }

  async transcribe(id: string) {
    const file = await this.repository.getById(id, this.sql);

    if (file instanceof Error) {
      return file;
    }

    return await this.transcribeLocalFile(file);
  }
}
