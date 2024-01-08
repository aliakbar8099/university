import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CourseRegistrationService } from './course-registration.service';
import { CourseRegistrationDto } from './dio/course-registration.dto';

@Controller('course-registration')
export class CourseRegistrationController {
    constructor(private readonly courseRegistrationService: CourseRegistrationService) { }

    @Post()
    async create(@Body() courseRegistrationData: CourseRegistrationDto) {
        return this.courseRegistrationService.create(courseRegistrationData);
    }

    @Get()
    async findAll() {
        return this.courseRegistrationService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.courseRegistrationService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() courseRegistrationData: Partial<CourseRegistrationDto>) {
        return this.courseRegistrationService.update(id, courseRegistrationData);
    }

    @Delete(':id')
    async remove(@Param('id') id: number) {
        return this.courseRegistrationService.remove(id);
    }
}
