import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Semester } from './semester.entity';
import { SemesterDto } from './dio/semester.dto';

@Injectable()
export class SemesterService {
    constructor(
        @InjectRepository(Semester)
        private semesterRepository: Repository<Semester>,
    ) { }

    async findAll(): Promise<Semester[]> {
        return await this.semesterRepository.find();
    }

    async findOne(id: number): Promise<Semester> {
        const university = await this.semesterRepository.findOne({
            where: { semesterId: id },
        });

        if (!university) {
            throw new NotFoundException(`College with ID ${id} not found`);
        }
        return university;
    }

    async create(semesterDto: SemesterDto) {
        const semester = this.semesterRepository.create(semesterDto);
        return this.semesterRepository.save(semester);
    }

    async update(id: number, semesterDto: SemesterDto) {
        const existingSemester = await this.semesterRepository.findOne({
            where: { semesterId: id },
        });

        if (!existingSemester) {
            throw new NotFoundException(`Semester with ID ${id} not found`);
        }

        this.semesterRepository.merge(existingSemester, semesterDto);
        return this.semesterRepository.save(existingSemester);
    }
}