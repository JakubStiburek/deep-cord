import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class RenameSpeakerDto {
  @ApiProperty({
    description: 'Current speaker name',
  })
  @MinLength(1)
  @MaxLength(100)
  @IsString()
  readonly speaker!: string;

  @ApiProperty({
    description: 'New speaker name',
  })
  @MinLength(1)
  @MaxLength(100)
  @IsString()
  readonly renameTo!: string;
}
