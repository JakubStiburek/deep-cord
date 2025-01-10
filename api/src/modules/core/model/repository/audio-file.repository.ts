import { Sql } from 'postgres';
import { Either, Maybe } from 'purify-ts';
import { AudioFile } from '../entity/audio-file.entity';
import { UncaughtException } from '../exception/uncaught.exception';
import { NotUniqueException } from '../exception/not-unique.exception';

export interface AudioFileRepository {
  add(
    name: string,
    uri: string,
    sql: Sql,
  ): Promise<AudioFile | UncaughtException | NotUniqueException>;

  getAll(sql: Sql): Promise<Either<UncaughtException, AudioFile[]>>;

  getById(
    id: string,
    sql: Sql,
  ): Promise<Either<UncaughtException, Maybe<AudioFile>>>;
}

export const AudioFileRepositorySymbol = Symbol('AudioFileRepository');
