import * as fs from 'fs';
import { Inject } from '@nestjs/common';
import { UploadFileDto } from '../ui/dto/upload-file.dto';
import { DateTime } from 'luxon';
import { Sql } from 'postgres';
import { AudioFileEntityRepositoryPostgres } from '../infrastructure/audio-file-entity-repository-postgres.implementation';
import { AudioFileEntityRepository } from '../model-zod/repository/audio-file-entity.repository';

export class AudioFileService {
  constructor(
    @Inject('UPLOAD_DIRECTORY_PATH')
    private readonly uploadDirectoryPath: string,
    @Inject('POSTGRES_CLIENT')
    private readonly sql: Sql,
    @Inject(AudioFileEntityRepositoryPostgres)
    private readonly repository: AudioFileEntityRepository,
  ) {}

  async add(file: Express.Multer.File, dto: UploadFileDto) {
    try {
      await fs.promises.access(this.uploadDirectoryPath, fs.constants.W_OK);
    } catch (_) {
      await fs.promises.mkdir(this.uploadDirectoryPath, { recursive: true });
    }

    const filename = AudioFileService.getFilename(
      file.originalname,
      dto.name,
      dto.extension,
    );

    const uri = `${this.uploadDirectoryPath}/record-${filename.name}-${DateTime.now().toISODate()}.${filename.extension}`;

    await fs.promises.writeFile(uri, file.buffer);

    return await this.repository.add(filename.name, uri, this.sql);
  }

  async getAll() {
    return await this.repository.getAll(this.sql);
  }

  async getById(id: string) {
    return await this.repository.getById(id, this.sql);
  }

  static getFilename(originalname: string, name?: string, extension?: string) {
    return {
      name: name || originalname.split('.')[0],
      extension: extension || originalname.split('.')[1] || 'mp3',
    };
  }
}
