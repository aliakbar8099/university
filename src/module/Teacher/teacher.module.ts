import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teachers } from './teacher.entity';
import { TeachersService } from './teacher.service';
import { TeacherController } from './teacher.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Teachers])],
    providers: [TeachersService],
    controllers: [TeacherController],
})
export class TeacherModule { }
