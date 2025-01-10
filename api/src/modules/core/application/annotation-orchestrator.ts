import { Inject } from '@nestjs/common';
import { Sql } from 'postgres';
import {
  AnnotationRepository,
  AnnotationRepositorySymbol,
} from '../model/repository/annotation.repository';
import { CreateAnnotationDto } from '../ui/dto/create-annotation.dto';
import {
  AudioFileRepository,
  AudioFileRepositorySymbol,
} from '../model/repository/audio-file.repository';
import { AnnotationSpan } from '../model/value-object/annotation-span.vo';
import { AnnotationType } from '../model/value-object/annotation-type.vo';

export class AnnotationOrchestrator {
  constructor(
    @Inject('POSTGRES_CLIENT')
    private readonly sql: Sql,

    @Inject(AnnotationRepositorySymbol)
    private readonly annotationRepository: AnnotationRepository,

    @Inject(AudioFileRepositorySymbol)
    private readonly fileRepository: AudioFileRepository,
  ) {}

  async add(fileId: string, dto: CreateAnnotationDto) {
    return await this.sql.begin(async (sql) => {
      const file = await this.fileRepository.getById(fileId, sql);

      if (file instanceof Error) {
        return file;
      }

      return await this.annotationRepository.add(
        file,
        new AnnotationSpan(dto.span.start, dto.span.end),
        new AnnotationType(dto.type),
        dto.value,
        sql,
      );
    });
  }

  async getAnnotationsForRecord(fileId: string) {
    return await this.sql.begin(async (sql) => {
      const file = await this.fileRepository.getById(fileId, sql);

      if (file instanceof Error) {
        return file;
      }

      return await this.annotationRepository.getAnnotationsForRecord(file, sql);
    });
  }
}
