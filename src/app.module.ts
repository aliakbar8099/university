import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentModule } from './module/Student/student.module';
import { TypeORMConfig } from './config/typeorm.config';
import { CollegeModule } from './module/College/College.module';
import { FieldStudyModule } from './module/FieldStudy/field.module';
import { courseModule } from './module/Course/course.module';
import { TeacherModule } from './module/Teacher/teacher.module';
import { PrereqModule } from './module/Prerequisite/prereq.module';
import { semesterModule } from './module/Semester/semester.module';
import { CourseRegistrationModule } from './module/CourseRegistration/course-registration.module';
import { AuthModule } from './module/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './module/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeORMConfig),
    UsersModule,
    AuthModule,
    ConfigModule.forRoot(),
    StudentModule,
    FieldStudyModule,
    CollegeModule,
    courseModule,
    TeacherModule,
    PrereqModule,
    semesterModule,
    CourseRegistrationModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
