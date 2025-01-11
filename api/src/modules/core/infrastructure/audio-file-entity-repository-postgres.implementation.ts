import { DateTime } from 'luxon';
import { Sql, PostgresError } from 'postgres';
import { File } from '../../../common/database/deep-cord-db-schema';
import { PostgresErrorCode } from './postgres-error-code.enum';
import { Logger, NotFoundException } from '@nestjs/common';
import { AudioFileEntityRepository } from '../model/repository/audio-file-entity.repository';
import {
  AudioFileEntity,
  AudioFileEntitySchema,
} from '../model/entity/audio-file.entity';
import { NotUniqueException } from '../model/exception/not-unique.exception';

export class AudioFileEntityRepositoryPostgres
  implements AudioFileEntityRepository
{
  private readonly logger = new Logger(AudioFileEntityRepositoryPostgres.name);

  async add(name: string, uri: string, sql: Sql) {
    try {
      const [file] = await sql<
        File[]
      >`insert into file (name, uri) values (${name}, ${uri}) returning *`;

      const audioFile = {
        id: file.id,
        name: file.name,
        uri: file.uri,
        createdAt: DateTime.fromJSDate(file.created_at),
        transcribed: file.transcribed,
      };

      return AudioFileEntitySchema.parse(audioFile);
    } catch (err) {
      this.logger.warn('Failed at method add', { err });
      if (
        err instanceof PostgresError &&
        err.code === PostgresErrorCode.UNIQUE_VIOLATION
      ) {
        throw new NotUniqueException();
      }

      throw err;
    }
  }

  async getAll(sql: Sql) {
    try {
      const files = await sql<
        File[]
      >`select id, name, uri, created_at, transcribed from file;`;

      if (files.length === 0) {
        return [];
      }

      return files.map(({ id, name, uri, created_at, transcribed }) =>
        AudioFileEntitySchema.parse({
          id,
          name,
          uri,
          createdAt: DateTime.fromJSDate(created_at),
          transcribed,
        }),
      );
    } catch (err) {
      this.logger.warn('Failed at method getAll', { err });
      throw err;
    }
  }

  async getById(id: string, sql: Sql) {
    try {
      const [file] = await sql<
        File[]
      >`select id, name, uri, created_at, transcribed from file where id = ${id}`;

      if (!file) {
        throw new NotFoundException();
      }

      const audioFile = {
        id: file.id,
        name: file.name,
        uri: file.uri,
        createdAt: DateTime.fromJSDate(file.created_at),
        transcribed: file.transcribed,
      };

      return AudioFileEntitySchema.parse(audioFile);
    } catch (err) {
      this.logger.warn('Failed at method getById', { err });
      if (
        err instanceof PostgresError &&
        err.code === PostgresErrorCode.UNIQUE_VIOLATION
      ) {
        throw new NotUniqueException();
      }

      throw err;
    }
  }

  async update(file: AudioFileEntity, sql: Sql) {
    try {
      await sql`update file set ${sql({ id: file.id, name: file.name, uri: file.uri, created_at: file.createdAt, transcribed: file.transcribed })}`;

      return file;
    } catch (err) {
      this.logger.warn('Failed at method update', { err });
      throw err;
    }
  }
}
