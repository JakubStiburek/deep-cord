import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Max } from 'class-validator';

export class UploadFileDto {
  @ApiPropertyOptional({
    example: 'my-audio-file',
  })
  @IsNotEmpty()
  @Max(100)
  @IsOptional()
  readonly name?: string;

  @ApiPropertyOptional({
    example: 'mp3',
    description:
      'Extension is inferred from filename, this field overrides it. If none is provided file extension defaults to mp3.',
  })
  @IsNotEmpty()
  @IsOptional()
  readonly extension?: string;

  @ApiProperty({
    format: 'binary',
  })
  @IsString()
  @IsNotEmpty()
  readonly file!: string;
}
