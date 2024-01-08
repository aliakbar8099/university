import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PrereqService } from './prereq.service';
import { PREREQ } from './prereq.entity';
import { prereqDto } from './dto/prereq.dto';

@Controller('prereq')
export class PrereqController {
  constructor(private readonly prereqService: PrereqService) {}

  @Post()
  create(@Body() prereqService: prereqDto) {
    return this.prereqService.create(prereqService);
  }

  @Get()
  findAll(): Promise<PREREQ[]> {
    return this.prereqService.findAllWithCourseInfo();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PREREQ> {
    return this.prereqService.findOneWithCourseInfo(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() prereq: PREREQ): Promise<PREREQ> {
    return this.prereqService.update(+id, prereq);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.prereqService.remove(+id);
  }
}
