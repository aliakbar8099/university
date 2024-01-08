import { Body, Controller, Delete, Ip, NotAcceptableException, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import RefreshTokenDto from './dto/refresh-token.dto';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/user.dto';
import { User } from '../users/users.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Req() request, @Ip() ip: string, @Body() body: LoginDto) {
    return this.authService.login(body.nationalCode, body.password, {
      ipAddress: ip,
      userAgent: request.headers['user-agent'],
    });
  }

  @Post('register')
  async createUser(@Req() request, @Ip() ip: string, @Body() userData: CreateUserDto): Promise<{ msg: string; accessToken: string } | NotAcceptableException> {
    const user = await this.authService.createUserWithAccessToken({
      ipAddress: ip,
      userAgent: request.headers['user-agent'],
    }, userData);
    return user;
  }

  @Post('refresh')
  async refreshToken(@Body() body: RefreshTokenDto) {
    return this.authService.refresh(body.refreshToken);
  }

  @Delete('logout')
  async logout(@Body() body: RefreshTokenDto) {
    return this.authService.logout(body.refreshToken);
  }
}