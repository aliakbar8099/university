import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { FieldStudyService } from './field.service';
import { FieldStudy } from './field.entity';
import { FSDto } from './dto/field.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('field') 
@Controller('field')
export class FieldStudyController {
  constructor(private readonly FieldStudy: FieldStudyService) {}

  @Post()
  create(@Body() FSDto: FSDto) {
    return this.FieldStudy.create(FSDto);
  }

  @Get()
  findAll(): Promise<FieldStudy[]> {
    return this.FieldStudy.findAllFieldWithDetails();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.FieldStudy.findOneFieldWithDetails(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() FSData: Partial<FieldStudy>): Promise<FieldStudy> {
    return this.FieldStudy.update(+id, FSData);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.FieldStudy.remove(+id);
  }
}
