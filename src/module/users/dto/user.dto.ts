import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

enum UserRole {
    Student = 'student',
    Teacher = 'teacher',
    Admin = 'admin',
}

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    nationalCode: string;

    @ApiProperty()
    @IsString()
    @IsPhoneNumber('IR', { message: 'Invalid Iranian phone number' })
    phoneNumber: string;

    @ApiProperty()
    @IsNotEmpty()
    birthDate: Date;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    gender: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    role: UserRole;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;
}

export class CreateUserDtoWithoutPassword {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    nationalCode: string;

    @ApiProperty()
    @IsString()
    @IsPhoneNumber('IR', { message: 'Invalid Iranian phone number' })
    phoneNumber: string;

    @ApiProperty()
    @IsNotEmpty()
    birthDate: Date;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    gender: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    role: UserRole;
}
