import { Controller, Post, Body, Put, Param, Get } from '@nestjs/common';
import { SemesterService } from './semester.service';
import { SemesterDto } from './dio/semester.dto';
import { Semester } from './semester.entity';

@Controller('semester')
export class SemesterController {
    constructor(private readonly semesterService: SemesterService) { }

    @Get()
    findAll(): Promise<Semester[]> {
        return this.semesterService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Semester> {
        return this.semesterService.findOne(+id);
    }

    @Post()
    async create(@Body() semesterDto: SemesterDto) {
        return this.semesterService.create(semesterDto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() semesterDto: SemesterDto): Promise<Semester> {
        return this.semesterService.update(+id, semesterDto);
    }
}
