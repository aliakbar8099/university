import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  nationalCode: string;

  @IsNotEmpty()
  password: string;
}