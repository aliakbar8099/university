import { IsNumber, IsNotEmpty, IsDateString } from 'class-validator';

export class gradDto {
  @IsNumber()
  @IsNotEmpty()
  STID: number;

  @IsNumber()
  @IsNotEmpty()
  COID: number;

  @IsNumber()
  @IsNotEmpty()
  value: number;
}

export class gradDtoFinal {
  @IsNumber()
  @IsNotEmpty()
  STID: number;

  @IsNumber()
  @IsNotEmpty()
  COID: number;
}