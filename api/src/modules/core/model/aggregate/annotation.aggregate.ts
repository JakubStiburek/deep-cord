import { ValidateNested } from 'class-validator';
import { Annotation } from '../entity/annotation.entity';
import { AudioFile } from '../entity/audio-file.entity';

export class AnnotationAggregate {
  /** Root entity */
  @ValidateNested()
  readonly annotation: Annotation;

  @ValidateNested()
  readonly file: AudioFile;

  constructor(annotation: Annotation, file: AudioFile) {
    this.annotation = annotation;
    this.file = file;
  }
}
