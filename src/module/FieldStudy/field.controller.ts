import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { FieldStudyService } from './field.service';
import { FieldStudy } from './field.entity';
import { FSDto } from './dto/field.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('field')
@Controller('field')
export class FieldStudyController {
  constructor(private readonly FieldStudy: FieldStudyService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() FSDto: FSDto) {
    return this.FieldStudy.create(FSDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('search') search: string, @Query('page') page: number, @Query('pageSize') pageSize: number, @Query('CollegeID') CollegeID: number): Promise<FieldStudy[]> {
    return this.FieldStudy.findAllFieldWithDetails(isNaN(page) ? 1 : page, isNaN(pageSize) ? 12 : pageSize, search ?? "", CollegeID);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.FieldStudy.findOneFieldWithDetails(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() FSData: Partial<FieldStudy>): Promise<FieldStudy> {
    return this.FieldStudy.update(+id, FSData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.FieldStudy.remove(+id);
  }
}
