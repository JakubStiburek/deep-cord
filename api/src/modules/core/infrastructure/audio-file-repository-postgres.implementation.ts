import { DateTime } from 'luxon';
import { Sql, PostgresError } from 'postgres';
import { Either, Right, Left } from 'purify-ts';
import { AudioFile } from '../model/entity/audio-file.entity';
import { UncaughtException } from '../model/exception/uncaught.exception';
import { AudioFileRepository } from '../model/repository/audio-file.repository';
import { File } from '../../../common/database/deep-cord-db-schema';
import { PostgresErrorCode } from './postgres-error-code.enum';
import { NotUniqueException } from '../model/exception/not-unique.exception';

export class AudioFileRepositoryPostgres implements AudioFileRepository {
  async add(
    name: string,
    uri: string,
    sql: Sql,
  ): Promise<Either<UncaughtException, AudioFile>> {
    try {
      const [file] = await sql<
        File[]
      >`insert into file (name, uri) values (${name}, ${uri}) returning *`;

      return Right(
        new AudioFile(
          file.id,
          file.name,
          file.uri,
          DateTime.fromJSDate(file.created_at),
        ),
      );
    } catch (err) {
      if (
        err instanceof PostgresError &&
        err.code === PostgresErrorCode.UNIQUE_VIOLATION
      ) {
        return Left(new NotUniqueException());
      }

      return Left(new UncaughtException(err));
    }
  }

  async getAll(sql: Sql): Promise<Either<UncaughtException, AudioFile[]>> {
    try {
      const files = await sql<
        File[]
      >`select id, name, uri, created_at from file;`;

      if (files.length === 0) {
        return Right([]);
      }

      return Right(
        files.map(
          ({ id, name, uri, created_at }) =>
            new AudioFile(id, name, uri, DateTime.fromJSDate(created_at)),
        ),
      );
    } catch (err) {
      return Left(new UncaughtException(err));
    }
  }
}
