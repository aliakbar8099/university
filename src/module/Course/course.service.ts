// student.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { COT } from './course.entity';
import { College } from '@/module/College/College.entity';
import { FieldStudy } from '@/module/FieldStudy/field.entity';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CourseDto } from './dto/course.dto';
import { Teachers } from '../Teacher/teacher.entity';

@Injectable()
export class CotService {
    constructor(
        @InjectRepository(COT)
        private readonly COTRepository: Repository<COT>,
    ) { }

    @ApiOperation({ summary: 'Create a new' })
    @ApiResponse({ status: 201, description: 'successfully created.' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiBody({ type: CourseDto })
    async create(COTData: CourseDto): Promise<COT> {
        const course = this.COTRepository.create(COTData);
        return await this.COTRepository.save(course);
    }

    async findAllCourseWithDetails(): Promise<any[]> {
        const courseDetails = await this.COTRepository
            .createQueryBuilder('c')
            .select([
                'COID',
                'COTITLE',
                'COTYPE',
                'CREDIT',
                'CFSID',
                'UniversityName',
                'FSName',
                'TENAME'
            ])
            .innerJoin(FieldStudy, 'f', 'c.CFSID = f.FSID')
            .innerJoin(Teachers, 't', 'c.CTEID = t.TEID')
            .innerJoin(College, 'u', 'f.STEID = u.UniversityID')
            .getRawMany();

        return courseDetails;
    }

    async findOneStudentWithDetails(id: number): Promise<any[]> {
        const courseDetails = await this.COTRepository
            .createQueryBuilder('c')
            .select([
                'COID',
                'COTITLE',
                'COTYPE',
                'CREDIT',
                'CFSID',
                'UniversityName',
                'FSName',
                'TENAME'
            ])
            .innerJoin(FieldStudy, 'f', 'c.CFSID = f.FSID')
            .innerJoin(Teachers, 't', 'c.CTEID = t.TEID')
            .innerJoin(College, 'u', 'f.STEID = u.UniversityID')
            .where('c.COID = :id', { id })
            .getRawOne();

        return courseDetails;
    }


    async update(id: number, studentData: Partial<COT>): Promise<COT> {
        await this.COTRepository.findOne({
            where: { COID: id },
        }); // Check if exists
        await this.COTRepository.update(id, studentData);
        return await this.COTRepository.findOne({
            where: { COID: id },
        });
    }

    /*
      DELETE FROM COT WHERE COID = @COID;
    */
    async remove(id: number): Promise<void> {
        const student = await this.COTRepository.findOne({
            where: { COID: id },
        });
        await this.COTRepository.remove(student);
    }

}
