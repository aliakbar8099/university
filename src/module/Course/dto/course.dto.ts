import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CourseDto {
  @ApiProperty({ example: 'Math', description: 'Title of the course' })
  @IsString()
  @IsNotEmpty()
  COTITLE: string;

  @ApiProperty({ example: 'C', description: 'Type of the course' })
  @IsString()
  @IsNotEmpty()
  COTYPE: string;

  @ApiProperty({ example: 3, description: 'Credit hours for the course' })
  @IsNumber()
  @IsNotEmpty()
  CREDIT: number;

  @ApiProperty({ example: 1, description: 'ID of the course field of study' })
  @IsNumber()
  @IsNotEmpty()
  CFSID: number;

  @ApiProperty({ example: 1, description: 'ID of the course teaching entity' })
  @IsNumber()
  @IsNotEmpty()
  CTEID: number;
}
