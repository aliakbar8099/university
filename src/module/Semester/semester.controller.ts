import { Controller, Post, Body, Put, Param, Get, UseGuards, Query, Delete, Req } from '@nestjs/common';
import { SemesterService } from './semester.service';
import { SemesterDto } from './dio/semester.dto';
import { Semester } from './semester.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('semester')
export class SemesterController {
    constructor(private readonly semesterService: SemesterService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@Query('search') search: string, @Query('page') page: number, @Query('pageSize') pageSize: number): Promise<Semester[]> {
        return this.semesterService.findAll(isNaN(page) ? 1 : page, isNaN(pageSize) ? 12 : pageSize, search ?? "");
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string): Promise<Semester> {
        return this.semesterService.findOne(+id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() semesterDto: SemesterDto) {
        return this.semesterService.create(semesterDto);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() Semester: Semester): Promise<Semester> {
        return this.semesterService.update(+id, Semester);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string): { msg: string } {
        this.semesterService.remove(+id);
        return { msg: "با موفقیت حذف شد" }
    }
}
