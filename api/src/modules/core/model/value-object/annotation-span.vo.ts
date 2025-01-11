import { IsNumber, Min } from 'class-validator';

export class AnnotationSpan {
  @IsNumber()
  @Min(0)
  readonly start: number;

  @IsNumber()
  @Min(0)
  readonly end: number;

  constructor(start: number, end: number) {
    this.start = start;
    this.end = end;
  }
}
