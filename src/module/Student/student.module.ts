import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { STT as Student } from '@/module/Student/student.entity';
import { StudentService } from '@/module/Student/student.service';
import { StudentController } from '@/module/Student/student.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Student])],
    providers: [StudentService],
    controllers: [StudentController],
})
export class StudentModule { }
