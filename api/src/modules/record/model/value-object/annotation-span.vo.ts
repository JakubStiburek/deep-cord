import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class AnnotationSpan {
  @IsInt()
  @Min(0)
  readonly start: number;

  @IsInt()
  @Min(0)
  readonly end: number;

  constructor(start: number, end: number) {
    this.start = start;
    this.end = end;
  }
}
