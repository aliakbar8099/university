import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req, Query } from '@nestjs/common';
import { CourseRegistrationService } from './course-registration.service';
import { CourseRegistrationDto } from './dio/course-registration.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { gradDto, gradDtoFinal } from './dio/grade.dto';
import { query } from 'express';

@Controller('course-registration')
export class CourseRegistrationController {
    constructor(private readonly courseRegistrationService: CourseRegistrationService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Req() request, @Body() courseRegistrationData: CourseRegistrationDto) {
        const userId = request.user.userId;
        return this.courseRegistrationService.create(userId, courseRegistrationData);
    }

    @UseGuards(JwtAuthGuard)
    @Post("/setGrade")
    async setGrade(@Body() data: gradDto) {
        this.courseRegistrationService.SetGrade(data);
        return {
            msg: "با موفقیت تغییر یافت"
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post("/setGrade/final")
    async setGradeFinal(@Body() data: gradDtoFinal) {
        this.courseRegistrationService.SetGradeFinal(data);
        return {
            msg: "با موفقیت تغییر یافت"
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(@Req() request) {
        const userId = request.user.userId;
        return this.courseRegistrationService.findAll(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get("/teacher")
    async findAllTeacher(@Req() request, @Query('courseId') courseId: string) {
        const userId = request.user.userId;
        return this.courseRegistrationService.findAllForTeacher(userId, +courseId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.courseRegistrationService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/info/:semesterId')
    async getAllInfo(@Req() request, @Param('semesterId') semesterId: string) {
        const userId = request.user.userId;
        return this.courseRegistrationService.getAllInfo(userId, +semesterId);
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
