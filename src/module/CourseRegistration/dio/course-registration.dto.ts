import { IsNumber, IsNotEmpty, IsDate, IsDateString } from 'class-validator';

export class CourseRegistrationDto {
  @IsNumber()
  @IsNotEmpty()
  RSTID: number;

  @IsNumber()
  @IsNotEmpty()
  RCOID: number;

  @IsNumber()
  @IsNotEmpty()
  semesterID: number;
  
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;
  
  @IsDateString()
  @IsNotEmpty()
  examDate: Date;
}
