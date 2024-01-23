import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { CotService } from './course.service';
import { CourseDto } from './dto/course.dto';
import { COT } from './course.entity';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('coureses')
@Controller('coureses')
export class courseController {
    constructor(private readonly CotController: CotService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() CourseDto: CourseDto) {
        return this.CotController.create(CourseDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAllStudentsWithDetails(@Query('search') search: string, @Query('page') page: number, @Query('pageSize') pageSize: number, @Query("COTYPE") COTYPE: string, @Query("FieldId") FieldId: string): Promise<any[]> {
        return this.CotController.findAllCourseWithDetails(isNaN(page) ? 1 : page, isNaN(pageSize) ? 12 : pageSize, search ?? "", COTYPE, FieldId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<any> {
        return this.CotController.findOneStudentWithDetails(+id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() studentData: Partial<COT>): Promise<COT> {
        return this.CotController.update(+id, studentData);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string): { msg: string } {
        this.CotController.remove(+id);
        return { msg: "با موفقیت حذف شد" }
    }
}
