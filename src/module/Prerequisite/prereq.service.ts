import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PREREQ } from './prereq.entity';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { prereqDto } from './dto/prereq.dto';
import { COT } from '../Course/course.entity';

@Injectable()
export class PrereqService {
    constructor(
        @InjectRepository(PREREQ)
        private readonly prereqRepository: Repository<PREREQ>,
        @InjectRepository(COT)
        private readonly cotRepository: Repository<COT>,
    ) { }

    async findAllWithCourseInfo(): Promise<PREREQ[]> {
        const query = this.prereqRepository
            .createQueryBuilder('prereq')
            .leftJoinAndSelect('prereq.course', 'course')
            .leftJoinAndSelect('prereq.preCourse', 'preCourse')
            .select([
                'prereq.PREID as id',
                'prereq.COID as COID',
                'prereq.PRECOID as PRECOID',
                'course.COTITLE as course_COTITLE',
                'preCourse.COTITLE as preCourse_COTITLE',
            ]);

        return query.getRawMany();
    }

    async findOneWithCourseInfo(id: number): Promise<PREREQ> {
        const query = this.prereqRepository
            .createQueryBuilder('prereq')
            .leftJoinAndSelect('prereq.course', 'course')
            .leftJoinAndSelect('prereq.preCourse', 'preCourse')
            .where('prereq.PREID = :id', { id })
            .select([
                'prereq.PREID as id',
                'prereq.COID as COID',
                'prereq.PRECOID as PRECOID',
                'course.COTITLE as course_COTITLE',
                'preCourse.COTITLE as preCourse_COTITLE',
            ]);

        return query.getRawOne();
    }

    @ApiOperation({ summary: 'Create a new' })
    @ApiResponse({ status: 201, description: 'successfully created.' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiBody({ type: prereqDto })
    async create(PrereqData: prereqDto): Promise<PREREQ> {

        // Check if COID exists in COT table
        const courseExists = await this.cotRepository.findOne({
            where: { COID: PrereqData.COID },
        });

        if (!courseExists) {
            throw new NotFoundException(`Course with COID ${PrereqData.COID} not found.`);
        }

        // Check if PRECOID exists in COT table
        const preCourseExists = await this.cotRepository.findOne({
            where: { COID: PrereqData.PRECOID },
        });

        if (!preCourseExists) {
            throw new NotFoundException(`PreCourse with PRECOID ${PrereqData.PRECOID} not found.`);
        }

        const course = this.prereqRepository.create(PrereqData);
        return await this.prereqRepository.save(course);
    }

    async update(id: number, prereq: PREREQ): Promise<PREREQ> {
        await this.prereqRepository.update(id, prereq);
        return this.prereqRepository.findOne({
            where: { COID: id },
        });
    }

    async remove(id: number): Promise<void> {
        await this.prereqRepository.delete({ PREID: id });
    }
}
