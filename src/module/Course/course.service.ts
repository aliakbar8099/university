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

    async findAllCourseWithDetails(page: number = 1, itemsPerPage: number = 12, searchTerm: string = "", COTYPE: string, FieldID: string): Promise<any[]> {
        const offset = (page - 1) * itemsPerPage;

        return await this.COTRepository
            .createQueryBuilder('c')
            .select([
                'COID as id',
                `CONCAT(COTITLE,' - ', 
                CASE c.COTYPE
                    WHEN 'A' THEN N'تخصصی'
                    WHEN 'B' THEN N'اصلی'
                    WHEN 'C' THEN N'پایه'
                    WHEN 'D' THEN N'عمومی'
                ELSE ''
                END,' - ',CREDIT,N' واحد') as COTITLE`,
                'COTYPE',
                'CREDIT',
                'CFSID',
                'CollegeName',
                'FSName',
                'CTEID',
                'TETITLE',
                `
                    CONCAT(
                        CASE c.weekDay
                            WHEN 6 THEN N'شنبه'
                            WHEN 0 THEN N'یک‌شنبه'
                            WHEN 1 THEN N'دوشنبه'
                            WHEN 2 THEN N'سه‌شنبه'
                            WHEN 3 THEN N'چهارشنبه'
                            WHEN 4 THEN N'پنج‌شنبه'
                            WHEN 5 THEN N'جمعه'
                            ELSE ''
                        END,
                        ' - ',
                        c.hour
                    ) AS course_time
                `,
                'examDate',
                "examHour",
                // "CONCAT(examDate,' - ',examHour) as exam_time"
            ])
            .innerJoin(FieldStudy, 'f', 'c.CFSID = f.FSID')
            .innerJoin(Teachers, 't', 'c.CTEID = t.TEID')
            .innerJoin(College, 'u', 'f.fk_CollegeID = u.CollegeID')
            .where(`COTITLE LIKE N'%${searchTerm}%'`)
            .where((!!COTYPE ? `COTYPE = '${COTYPE}'` : '1=1') + (` ${!!FieldID ? `AND CFSID = ${FieldID}` : ``}`))
            .offset(offset)
            .limit(itemsPerPage)
            .getRawMany()
            .then(results => {
                return results.map(result => {
                    result["exam_time"] = `${new Date(result.examDate).toLocaleDateString('fa-IR')} - ${result.examHour}`
                    return result;
                });
            });
    }

    async findCourseForTeacher(id:number){
        const data = await this.COTRepository.query(`
        SELECT 
            COID,
            COTITLE
        FROM cot c
        JOIN teachers t ON t.TEID = c.CTEID
        JOIN [dbo].[user] u ON u.id = t.userId
        WHERE userId = ${id}
        `)
        
        return data
    }

    async findOneStudentWithDetails(id: number): Promise<any[]> {
        const courseDetails = await this.COTRepository
            .createQueryBuilder('c')
            .select([
                'COID as id',
                'COTITLE',
                'COTYPE',
                'CREDIT',
                'CFSID',
                'CollegeName',
                'FSName',
                'CTEID',
                'TETITLE'
            ])
            .innerJoin(FieldStudy, 'f', 'c.CFSID = f.FSID')
            .innerJoin(Teachers, 't', 'c.CTEID = t.TEID')
            .innerJoin(College, 'u', 'f.fk_CollegeID = u.CollegeID')
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
