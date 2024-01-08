import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class prereqDto {
  @ApiProperty({ example: 1, description: 'Course ID' })
  @IsNumber()
  @IsNotEmpty()
  COID: number;

  @ApiProperty({ example: 2, description: 'Prerequisite Course ID' })
  @IsNumber()
  @IsNotEmpty()
  PRECOID: number;
}
