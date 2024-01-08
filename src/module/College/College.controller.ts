import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CollegeService } from './College.service';
import { College } from './College.entity';
import { CollegeDto } from './dto/College.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('College') 
@Controller('College')
export class CollegeController {
  constructor(private readonly CollegeService: CollegeService) {}

  @Post()
  create(@Body() CollegeDto: CollegeDto) {
    return this.CollegeService.create(CollegeDto);
  }

  @Get()
  findAll(): Promise<College[]> {
    return this.CollegeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<College> {
    return this.CollegeService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() studentData: Partial<College>): Promise<College> {
    return this.CollegeService.update(+id, studentData);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.CollegeService.remove(+id);
  }
}
