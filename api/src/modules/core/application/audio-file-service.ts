import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as fs from 'fs';
import { Inject, InternalServerErrorException, Logger } from '@nestjs/common';
import { UploadFileDto } from '../ui/dto/upload-file.dto';
import { DateTime } from 'luxon';
import { Sql } from 'postgres';
import { AudioFileEntityRepositoryPostgres } from '../infrastructure/audio-file-entity-repository-postgres.implementation';
import { AudioFileEntityRepository } from '../model/repository/audio-file-entity.repository';

export class AudioFileService {
  private readonly logger = new Logger(AudioFileService.name);
  constructor(
    @Inject('UPLOAD_DIRECTORY_PATH')
    private readonly uploadDirectoryPath: string,
    @Inject('POSTGRES_CLIENT')
    private readonly sql: Sql,
    @Inject(AudioFileEntityRepositoryPostgres)
    private readonly repository: AudioFileEntityRepository,
    @Inject('CLOUDINARY_CREDENTIALS')
    private readonly cloudinaryCredentials: {
      name: string;
      apiKey: string;
      apiSecret: string;
    },
  ) {}

  async add(file: Express.Multer.File, dto: UploadFileDto) {
    const filename = AudioFileService.getFilename(
      file.originalname,
      dto.name,
      dto.extension,
    );

    const uri = await this.uploadFileToCloudinary(
      file,
      `record-${filename.name}-${DateTime.now().toISODate()}`,
    );

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

  private async uploadFileToCloudinary(
    file: Express.Multer.File,
    name: string,
  ) {
    cloudinary.config({
      cloud_name: this.cloudinaryCredentials.name,
      api_key: this.cloudinaryCredentials.apiKey,
      api_secret: this.cloudinaryCredentials.apiSecret,
    });

    const result: UploadApiResponse | undefined = await new Promise(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { resource_type: 'video', public_id: name },
            (error, uploadResult) => {
              if (error) reject(error);
              return resolve(uploadResult);
            },
          )
          .end(file.buffer);
      },
    );

    if (!result) {
      this.logger.warn('Upload to Cloudinary failed');
      throw new InternalServerErrorException();
    }

    return result.url;
  }
}
