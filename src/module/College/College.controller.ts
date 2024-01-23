import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { CollegeService } from './College.service';
import { College } from './College.entity';
import { CollegeDto } from './dto/College.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('College') 
@Controller('College')
export class CollegeController {
  constructor(private readonly CollegeService: CollegeService) {}
 @UseGuards(JwtAuthGuard)
 @Post()
 create(@Body() CollegeDto: CollegeDto) {
   return this.CollegeService.create(CollegeDto);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('search') search: string, @Query('page') page: number, @Query('pageSize') pageSize: number): Promise<College[]> {
    return this.CollegeService.findAll(isNaN(page) ? 1 : page, isNaN(pageSize) ? 12 : pageSize, search ?? "");
}
  
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<College> {
    return this.CollegeService.findOne(+id);
  }
  
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() studentData: Partial<College>): Promise<College> {
    return this.CollegeService.update(+id, studentData);
  }
  
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.CollegeService.remove(+id);
  }
}
