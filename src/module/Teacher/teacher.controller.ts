import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { TeachersService } from './teacher.service';
import { TeachersDto } from './dto/teacher.dto';
import { Teachers } from './teacher.entity';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Teacher')
@Controller('teachers')
export class TeacherController {
    constructor(private readonly teachController: TeachersService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() TeacherDto: TeachersDto) {
        return this.teachController.create(TeacherDto);
    }
    @UseGuards(JwtAuthGuard)
    @Get()
    async findAllStudentsWithDetails(@Query('userId') userId: string): Promise<any[]> {
        return this.teachController.findAll(+userId);
    }
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<any> {
        return this.teachController.findOne(+id);
    }
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() studentData: Partial<Teachers>): Promise<Teachers> {
        return this.teachController.update(+id, studentData);
    }
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string): { msg: string } {
        this.teachController.remove(+id);
        return { msg: "با موفقیت حذف شد" }
    }
}
