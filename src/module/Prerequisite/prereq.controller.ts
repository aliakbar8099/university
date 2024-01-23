import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { PrereqService } from './prereq.service';
import { PREREQ } from './prereq.entity';
import { prereqDto } from './dto/prereq.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('prereq')
export class PrereqController {
  constructor(private readonly prereqService: PrereqService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() prereqService: prereqDto) {
    return this.prereqService.create(prereqService);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<PREREQ[]> {
    return this.prereqService.findAllWithCourseInfo();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<PREREQ> {
    return this.prereqService.findOneWithCourseInfo(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() prereq: PREREQ): Promise<PREREQ> {
    return this.prereqService.update(+id, prereq);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): { msg: string } {
    this.prereqService.remove(+id);
    return { msg: "با موفقیت حذف شد" }
  }
}
