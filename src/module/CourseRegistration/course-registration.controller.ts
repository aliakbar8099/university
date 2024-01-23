import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { CourseRegistrationService } from './course-registration.service';
import { CourseRegistrationDto } from './dio/course-registration.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('course-registration')
export class CourseRegistrationController {
    constructor(private readonly courseRegistrationService: CourseRegistrationService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() courseRegistrationData: CourseRegistrationDto) {
        return this.courseRegistrationService.create(courseRegistrationData);
    }
    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll() {
        return this.courseRegistrationService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.courseRegistrationService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@Param('id') id: number, @Body() courseRegistrationData: Partial<CourseRegistrationDto>) {
        return this.courseRegistrationService.update(id, courseRegistrationData);
    }
    
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: number) {
        return this.courseRegistrationService.remove(id);
    }
}
