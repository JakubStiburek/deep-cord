import * as fs from 'fs';
import { Inject } from '@nestjs/common';
import {
  AudioFileRepository,
  AudioFileRepositorySymbol,
} from '../model/repository/audio-file.repository';
import { UploadFileDto } from '../ui/dto/upload-file.dto';
import { DateTime } from 'luxon';
import { Sql } from 'postgres';

export class AudioFileOrchestrator {
  constructor(
    @Inject('UPLOAD_DIRECTORY_PATH')
    private readonly uploadDirectoryPath: string,
    @Inject('POSTGRES_CLIENT')
    private readonly sql: Sql,
    @Inject(AudioFileRepositorySymbol)
    private readonly repository: AudioFileRepository,
  ) {}

  async add(file: Express.Multer.File, dto: UploadFileDto) {
    try {
      await fs.promises.access(this.uploadDirectoryPath, fs.constants.W_OK);
    } catch (_) {
      await fs.promises.mkdir(this.uploadDirectoryPath, { recursive: true });
    }

    const filename = AudioFileOrchestrator.getFilename(
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
