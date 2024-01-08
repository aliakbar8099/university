import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Semester } from './semester.entity';
import { SemesterService } from './semester.service';
import { SemesterController } from './semester.controller'

@Module({
    imports: [TypeOrmModule.forFeature([Semester])],
    providers: [SemesterService],
    controllers: [SemesterController],
})
export class semesterModule { }
