import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FSDto {
  @ApiProperty({ example: 'Computer Science', description: 'Name of the study field' })
  @IsString()
  @IsNotEmpty()
  FSName: string;

  @ApiProperty({ example: 1, description: 'College ID' })
  @IsNumber()
  @IsNotEmpty()
  STEID: number;
}
