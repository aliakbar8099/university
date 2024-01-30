import { IsNotEmpty, IsString, IsNumber, IsInt, Min, Max, IsDateString } from 'class-validator';
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

  @ApiProperty({ example: 0, description: 'Day of the week (0 to 6)' })
  @IsInt()
  @Min(0)
  @Max(6)
  @IsNotEmpty()
  weekDay: number;

  @ApiProperty({ example: '05:30', description: 'Time in HH:mm format' })
  @IsNotEmpty()
  hour: string;

  @IsDateString()
  @IsNotEmpty()
  examDate: Date;

  @ApiProperty({ example: '05:30', description: 'Time in HH:mm format' })
  @IsNotEmpty()
  examHour: string;
}
