import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { TeachersService } from './teacher.service';
import { TeachersDto } from './dto/teacher.dto';
import { Teachers } from './teacher.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Teacher') 
@Controller('teachers')
export class TeacherController {
    constructor(private readonly teachController: TeachersService) { }

    @Post()
    create(@Body() TeacherDto: TeachersDto) {
        return this.teachController.create(TeacherDto);
    }

    @Get()
    async findAllStudentsWithDetails(): Promise<any[]> {
        return this.teachController.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<any> {
        return this.teachController.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() studentData: Partial<Teachers>): Promise<Teachers> {
        return this.teachController.update(+id, studentData);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.teachController.remove(+id);
    }
}
