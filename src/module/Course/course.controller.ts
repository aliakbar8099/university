import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CotService } from './course.service';
import { CourseDto } from './dto/course.dto';
import { COT } from './course.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('coureses') 
@Controller('coureses')
export class courseController {
    constructor(private readonly CotController: CotService) { }

    @Post()
    create(@Body() CourseDto: CourseDto) {
        return this.CotController.create(CourseDto);
    }

    @Get()
    async findAllStudentsWithDetails(): Promise<any[]> {
        return this.CotController.findAllCourseWithDetails();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<any> {
        return this.CotController.findOneStudentWithDetails(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() studentData: Partial<COT>): Promise<COT> {
        return this.CotController.update(+id, studentData);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.CotController.remove(+id);
    }
}
