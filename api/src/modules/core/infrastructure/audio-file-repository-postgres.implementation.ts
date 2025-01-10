import { DateTime } from 'luxon';
import { Sql, PostgresError } from 'postgres';
import { Either, Right, Left, Maybe, Nothing, Just } from 'purify-ts';
import { AudioFile } from '../model/entity/audio-file.entity';
import { UncaughtException } from '../model/exception/uncaught.exception';
import { AudioFileRepository } from '../model/repository/audio-file.repository';
import { File } from '../../../common/database/deep-cord-db-schema';
import { PostgresErrorCode } from './postgres-error-code.enum';
import { NotUniqueException } from '../model/exception/not-unique.exception';
import { Logger } from '@nestjs/common';
import { FileNotFoundException } from '../model/exception/file-not-found.exception';

export class AudioFileRepositoryPostgres implements AudioFileRepository {
  private readonly logger = new Logger(AudioFileRepositoryPostgres.name);
  async add(name: string, uri: string, sql: Sql) {
    try {
      const [file] = await sql<
        File[]
      >`insert into file (name, uri) values (${name}, ${uri}) returning *`;

      return new AudioFile(
        file.id,
        file.name,
        file.uri,
        DateTime.fromJSDate(file.created_at),
      );
    } catch (err) {
      if (
        err instanceof PostgresError &&
        err.code === PostgresErrorCode.UNIQUE_VIOLATION
      ) {
        return new NotUniqueException();
      }

      this.logger.warn({ err });
      return new UncaughtException(
        'AudioFileRepositoryPostgres uncaught exception',
      );
    }
  }

  async getAll(sql: Sql) {
    try {
      const files = await sql<
        File[]
      >`select id, name, uri, created_at from file;`;

      if (files.length === 0) {
        return [];
      }

      return files.map(
        ({ id, name, uri, created_at }) =>
          new AudioFile(id, name, uri, DateTime.fromJSDate(created_at)),
      );
    } catch (err) {
      this.logger.warn({ err });
      return new UncaughtException(
        'AudioFileRepositoryPostgres uncaught exception',
      );
    }
  }

  async getById(id: string, sql: Sql) {
    try {
      const [file] = await sql<
        File[]
      >`select id, name, uri, created_at from file where id = ${id}`;

      if (!file) {
        return new FileNotFoundException();
      }

      return new AudioFile(
        file.id,
        file.name,
        file.uri,
        DateTime.fromJSDate(file.created_at),
      );
    } catch (err) {
      this.logger.warn({ err });
      return new UncaughtException(
        'AudioFileRepositoryPostgres uncaught exception',
      );
    }
  }
}
