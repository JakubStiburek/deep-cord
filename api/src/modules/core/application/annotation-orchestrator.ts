import { Inject, Logger, NotFoundException } from '@nestjs/common';
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
import { Either, Left, Right } from 'purify-ts';
import { AnnotationAggregate } from '../model/aggregate/annotation.aggregate';
import { InvariantViolationException } from '../model/exception/invariant-violation.exception';
import { UncaughtException } from '../model/exception/uncaught.exception';

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
      let result: Either<
        UncaughtException | InvariantViolationException | NotFoundException,
        AnnotationAggregate
      >;

      const eitherFile = await this.fileRepository.getById(fileId, sql);

      if (eitherFile.isRight() && eitherFile.extract().isJust()) {
        result = await this.annotationRepository.add(
          eitherFile.extract().extract(),
          new AnnotationSpan(dto.span.start, dto.span.end),
          new AnnotationType(dto.type),
          dto.value,
          sql,
        );
      } else if (eitherFile.isRight() && eitherFile.extract().isNothing()) {
        result = Left(new NotFoundException());
      } else if (eitherFile.isLeft()) {
        result = eitherFile;
      }

      if (result.isLeft()) {
        throw result.extract();
      }

      return result;
    });
  }

  async getAnnotationsForRecord(fileId: string) {
    return await this.sql.begin(async (sql) => {
      let result: Either<
        UncaughtException | InvariantViolationException,
        AnnotationAggregate[]
      >;
      let annotations: AnnotationAggregate[] = [];

      const eitherFile = await this.fileRepository.getById(fileId, sql);

      if (eitherFile.isRight() && eitherFile.extract().isJust()) {
        const eitherAnnotations =
          await this.annotationRepository.getAnnotationsForRecord(
            eitherFile.extract().extract(),
            sql,
          );

        if (eitherAnnotations.isRight()) {
          annotations = eitherAnnotations.extract();
        }

        result = eitherAnnotations;
      } else if (eitherFile.isRight() && eitherFile.extract().isNothing()) {
        result = Left(new NotFoundException());
      } else if (eitherFile.isLeft()) {
        result = eitherFile;
      }

      return Right(annotations);
    });
  }
}
