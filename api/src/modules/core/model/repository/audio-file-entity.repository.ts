import { Sql } from 'postgres';
import { AudioFileEntity } from '../entity/audio-file.entity';

export interface AudioFileEntityRepository {
  add(name: string, uri: string, sql: Sql): Promise<AudioFileEntity>;

  getAll(sql: Sql): Promise<AudioFileEntity[]>;

  getById(id: string, sql: Sql): Promise<AudioFileEntity>;

  save(file: AudioFileEntity, sql: Sql): Promise<AudioFileEntity>;
}
