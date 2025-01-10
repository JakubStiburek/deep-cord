import { Sql } from 'postgres';
import { AudioFile } from '../entity/audio-file.entity';
import { UncaughtException } from '../exception/uncaught.exception';
import { NotUniqueException } from '../exception/not-unique.exception';
import { FileNotFoundException } from '../exception/file-not-found.exception';

export interface AudioFileRepository {
  add(
    name: string,
    uri: string,
    sql: Sql,
  ): Promise<AudioFile | UncaughtException | NotUniqueException>;

  getAll(sql: Sql): Promise<AudioFile[] | UncaughtException>;

  getById(
    id: string,
    sql: Sql,
  ): Promise<AudioFile | UncaughtException | FileNotFoundException>;

  update(file: AudioFile, sql: Sql): Promise<AudioFile | UncaughtException>;
}

export const AudioFileRepositorySymbol = Symbol('AudioFileRepository');
