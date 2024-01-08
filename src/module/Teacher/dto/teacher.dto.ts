import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, MaxLength } from 'class-validator';

export class TeachersDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  TETITLE: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  TELEV: string;

  @ApiProperty()
  @IsString()
  @MaxLength(4)
  @IsNotEmpty()
  graduationYear: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  fieldStudyId: number;
}
