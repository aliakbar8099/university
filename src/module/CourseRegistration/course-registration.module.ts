import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseRegistration } from './course-registration.entity';
import { CourseRegistrationService } from './course-registration.service';
import { CourseRegistrationController } from './course-registration.controller'
import { COT } from '../Course/course.entity';
import { PREREQ } from '../Prerequisite/prereq.entity';

@Module({
    imports: [TypeOrmModule.forFeature([CourseRegistration, COT , PREREQ])],
    providers: [CourseRegistrationService],
    controllers: [CourseRegistrationController],
})
export class CourseRegistrationModule { }
