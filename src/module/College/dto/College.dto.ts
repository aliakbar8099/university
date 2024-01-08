import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CollegeDto {
  @ApiProperty({ example: 'Example College', description: 'College Name' })
  @IsString()
  @IsNotEmpty()
  CollegeName: string;
}

