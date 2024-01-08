import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class StudentDto {
  // @IsString()
  // @IsNotEmpty()
  // @ApiProperty({ description: 'The name of the student', example: 'John Doe' })
  // STNAME: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The level of the student', example: 'Bachelor' })
  STLEV: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'The ID of the associated field of study', example: 1 })
  FSID: number;
  
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'userId', example: 1 })
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'semesterID', example: 1 })
  semesterID: number;
}
