import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { CreateUserDtoWithoutPassword } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  Create(@Body() userData: CreateUserDtoWithoutPassword): Promise<any[]> {
    return this.userService.createWithoutPassword(userData)
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('role') role: string,
    @Query('gender') gender: string): Promise<User[]> {
    return this.userService.findAll(isNaN(page) ? 1 : page, isNaN(pageSize) ? 12 : pageSize, search ?? "", role, gender);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  me(@Req() request) {
    const userId = request.user.userId;
    return this.userService.findOne(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/semester')
  findAllSemesterByUser(@Req() request) {
    const userId = request.user.userId;
    return this.userService.findAllSemesterByUser(userId);
  }


}