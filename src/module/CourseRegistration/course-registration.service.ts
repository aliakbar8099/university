import { ForbiddenException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseRegistration } from './course-registration.entity';
import { CourseRegistrationDto } from './dio/course-registration.dto';
import { COT } from '../Course/course.entity';
import { PREREQ } from '../Prerequisite/prereq.entity';

@Injectable()
export class CourseRegistrationService {
    constructor(
        @InjectRepository(CourseRegistration)
        private courseRegistrationRepository: Repository<CourseRegistration>,
        @InjectRepository(COT)
        private COTRepository: Repository<COT>,
        @InjectRepository(PREREQ)
        private PREREQRepository: Repository<PREREQ>
    ) { }

    async create(courseRegistrationData: CourseRegistrationDto) {

        const findCourse = await this.COTRepository.query(`select COTYPE from COT where COID = ${courseRegistrationData.RCOID}`)
        const findExitCR = await this.courseRegistrationRepository.query(`select * from course_registration where RCOID = ${courseRegistrationData.RCOID}`)
        const examDate = new Date(courseRegistrationData.examDate);
        const startDate = new Date(courseRegistrationData.startDate);

        const findCRTimeExam = await this.courseRegistrationRepository.query(`
        SELECT c.COTITLE
        FROM course_registration cr
        JOIN cot c ON cr.RCOID = c.COID
        WHERE CONVERT(VARCHAR, cr.examDate, 23) = '${examDate.toISOString().substring(0, 10)}'
        `);

        const findCRTimeStart = await this.COTRepository.query(`
        SELECT c.COTITLE
        FROM course_registration cr
        JOIN cot c ON cr.RCOID = c.COID
        WHERE CONVERT(VARCHAR, cr.startDate, 23) = '${startDate.toISOString().substring(0, 10)}'
        `);

        if (!!findExitCR.length) {
            throw new NotAcceptableException(`درس مورد نظر قبلا ثبت شده`)
        }

        if (!!findCRTimeStart.length) {
            throw new NotAcceptableException(`تاریخ شروع کلاس درس مورد نظر با درس ${findCRTimeStart[0].COTITLE} تداخل داره`)
        }

        if (!!findCRTimeExam.length) {
            throw new NotAcceptableException(`تاریخ امتحان درس مورد نظر با درس ${findCRTimeExam[0].COTITLE} تداخل داره`)
        }


        if (!findCourse.length) {
            throw new NotFoundException('درس مورد نظر وجود ندارد');
        }

        if (findCourse[0].COTYPE.toLowerCase() == "c") {
            const courseRegistration = this.courseRegistrationRepository.create(courseRegistrationData);
            this.courseRegistrationRepository.save(courseRegistration);
            return { msg: "انتخاب واحد با موفقیت انجام شد" }
        }

        if (findCourse[0].COTYPE.toLowerCase() == "b" || findCourse[0].COTYPE.toLowerCase() == "a") {
            const prereq = await this.PREREQRepository
                .createQueryBuilder("p")
                .leftJoin("p.preCourse", "preCourse")
                .select([
                    "preCourse.COTITLE",
                    "preCourse.COID"
                ])
                .where('p.COID  = :id', { id: courseRegistrationData.RCOID })
                .getRawOne()

            const CR = await this.courseRegistrationRepository
                .createQueryBuilder("cr")
                .where('cr.RCOID = :id', { id: prereq.preCourse_COID })
                .getRawOne()

            if (!CR) {
                throw new NotFoundException({ msg: 'پیش نیاز درس مورد نظر هنوز اخز نشده است', prereq });
            }

            if (CR.cr_grade < 12) {
                throw new ForbiddenException({ msg: 'پیش نیاز درس مورنظر گذرانده نشده است', grade: CR.cr_grade });
            }

            const courseRegistration = this.courseRegistrationRepository.create(courseRegistrationData);
            this.courseRegistrationRepository.save(courseRegistration);
            return { msg: "انتخاب واحد با موفقیت انجام شد" }
        }
    }

    async findAll() {
        return this.courseRegistrationRepository
            .createQueryBuilder('registration')
            .select([
                'registration.REID as RegistrationID',
                'registration.RSTID as StudentID',
                // 'student.STNAME as StudentName',
                'registration.RCOID as CourseID',
                'course.COTITLE as CourseName',
                'teachers.TEID as TeacherID',
                'teachers.TENAME as TeacherName',
                'registration.semester as SemesterName',
                'registration.grade as Grade',
                'registration.createdAt as RegistrationDate',
            ])
            .leftJoin('registration.student', 'student')
            .leftJoin('registration.course', 'course')
            .leftJoin('course.teachers', 'teachers')
            .getRawMany();
    }

    async findOne(id: number) {
        return this.courseRegistrationRepository
            .createQueryBuilder('registration')
            .select([
                'registration.REID as RegistrationID',
                'registration.RSTID as StudentID',
                // 'student.STNAME as StudentName',
                'registration.RCOID as CourseID',
                'course.COTITLE as CourseName',
                'teachers.TEID as TeacherID',
                'teachers.TENAME as TeacherName',
                'registration.semester as SemesterName',
                'registration.grade as Grade',
                'registration.createdAt as RegistrationDate',
            ])
            .leftJoin('registration.student', 'student')
            .leftJoin('registration.course', 'course')
            .leftJoin('course.teachers', 'teachers')
            .where("registration.REID = :id", { id })
            .getRawOne();
    }


    async update(id: number, courseRegistrationData: Partial<CourseRegistration>) {
        await this.courseRegistrationRepository.update(id, courseRegistrationData);
        return this.findOne(id);
    }

    async remove(id: number) {
        await this.courseRegistrationRepository.delete(id);
        return { deleted: true };
    }
}
