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

    async findAll(page: number = 1, itemsPerPage: number = 12, searchTerm: string = ""): Promise<Semester[]> {

        const skip = (page - 1) * itemsPerPage;
        return await this.semesterRepository
            .createQueryBuilder("s")
            .select([
                "semesterId as id",
                "name",
                "startDate",
                "endDate"
            ])
            .where(`name LIKE N'%${searchTerm}%'`)
            .skip(skip)
            .take(itemsPerPage)
            .getRawMany();
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

    async searchByName(searchTerm: string): Promise<Semester[]> {
        return await this.semesterRepository
            .query(`
            SELECT 
            semesterId as id",
            name,
            startDate,
            endDate
            FROM semester
            WHERE name LIKE N'%${searchTerm}%'
            `)
    }

    async create(semesterDto: SemesterDto) {
        const semester = this.semesterRepository.create(semesterDto);
        return this.semesterRepository.save(semester);
    }

    async update(id: number, semesterDto: Semester) {
        const existingSemester = await this.semesterRepository.findOne({
            where: { semesterId: id },
        });

        if (!existingSemester) {
            throw new NotFoundException(`Semester with ID ${id} not found`);
        }

        this.semesterRepository.merge(existingSemester, semesterDto);
        return this.semesterRepository.save(existingSemester);
    }

    async remove(id: number): Promise<void> {
        const find = await this.findOne(id);
        await this.semesterRepository.remove(find);
    }
}