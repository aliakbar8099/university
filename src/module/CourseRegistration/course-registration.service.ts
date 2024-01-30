import { ForbiddenException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseRegistration } from './course-registration.entity';
import { CourseRegistrationDto } from './dio/course-registration.dto';
import { COT } from '../Course/course.entity';
import { PREREQ } from '../Prerequisite/prereq.entity';
import { gradDto, gradDtoFinal } from './dio/grade.dto';
import { User } from '../users/users.entity';
import { Teachers } from '../Teacher/teacher.entity';

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

    async create(userId: number, courseRegistrationData: CourseRegistrationDto) {
        
        const findCourse = await this.COTRepository.query(`select COTYPE from COT where COID = ${courseRegistrationData.RCOID}`)
        const findExitCR = await this.courseRegistrationRepository.query(`select * from course_registration where RCOID = ${courseRegistrationData.RCOID} 
        AND RSTID IN (SELECT STID FROM stt WHERE userId = ${userId}) `)

        const findCourse_time = await this.courseRegistrationRepository.query(`
        SELECT * FROM course_registration cr
        JOIN  cot c ON c.COID = cr.RCOID
        WHERE cr.RSTID = ${courseRegistrationData.RSTID}
        AND c.weekDay = (SELECT weekDay FROM cot WHERE COID = '${courseRegistrationData.RCOID}')
        AND c.hour = (SELECT hour FROM cot WHERE COID = '${courseRegistrationData.RCOID}')`);

        const findExam_time = await this.COTRepository.query(`
        SELECT * FROM course_registration cr
        JOIN cot c ON c.COID = cr.RCOID
        WHERE cr.RSTID = ${courseRegistrationData.RSTID}
        AND c.examDate = (SELECT examDate FROM cot WHERE COID = '${courseRegistrationData.RCOID}')
        AND c.examHour = (SELECT examHour FROM cot WHERE COID = '${courseRegistrationData.RCOID}')`);

        if (!!findExitCR.length) {
            throw new NotAcceptableException(`درس مورد نظر قبلا ثبت شده`)
        }

        if (!!findCourse_time.length) {
            throw new NotAcceptableException(`زمان کلاس درس مورد نظر با درس ${findCourse_time[0].COTITLE} تداخل داره`)
        }

        if (!!findExam_time.length) {
            throw new NotAcceptableException(`تاریخ امتحان درس مورد نظر با درس ${findExam_time[0].COTITLE} تداخل داره`)
        }

        if (!findCourse.length) {
            throw new NotFoundException('درس مورد نظر وجود ندارد');
        }

        if (findCourse[0].COTYPE.toLowerCase() == "c" || findCourse[0].COTYPE.toLowerCase() == "d") {
            const courseRegistration = this.courseRegistrationRepository.create(courseRegistrationData);
            this.courseRegistrationRepository.save(courseRegistration);
            return { msg: "انتخاب واحد با موفقیت انجام شد" }
        }

        if (findCourse[0].COTYPE.toLowerCase() == "b" || findCourse[0].COTYPE.toLowerCase() == "a") {

            const CR = await this.courseRegistrationRepository
                .query(`SELECT *
            FROM course_registration
            WHERE RCOID = (SELECT PRECOID FROM prereq WHERE COID = '${courseRegistrationData.RCOID}') AND RSTID IN (SELECT STID FROM stt WHERE userId = ${userId})`)

            if (!CR[0]) {
                throw new NotAcceptableException('پیش نیاز درس مورد نظر هنوز اخز نشده است');
            }

            if (CR[0].grade < 12) {
                throw new NotAcceptableException('پیش نیاز درس مورنظر گذرانده نشده است');
            }

            const courseRegistration = this.courseRegistrationRepository.create(courseRegistrationData);
            this.courseRegistrationRepository.save(courseRegistration);
            return { msg: "انتخاب واحد با موفقیت انجام شد" }
        }
    }

    async findAll(userId: number) {

        return this.courseRegistrationRepository
            .createQueryBuilder('registration')
            .select([
                'registration.REID as id',
                'registration.RSTID as StudentID',
                'registration.RCOID as CourseID',
                'course.COTITLE as CourseName',
                'course.CREDIT as CREDIT',
                `
                    CONCAT(
                        CASE course.weekDay
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
                        course.hour
                    ) AS course_time
                `,
                'teachers.TEID as TeacherID',
                'teachers.TETITLE as TeacherName',
                'registration.semester as SemesterName',
                'registration.grade as Grade',
                'registration.createdAt as RegistrationDate',
                'course.examDate as examDate',
                "course.examHour as examHour",
            ])
            .innerJoin('registration.student', 'student')
            .innerJoin('registration.course', 'course')
            .innerJoin('course.teachers', 'teachers')
            .where(`registration.RSTID IN (SELECT STID FROM stt WHERE userId = '${userId}') 
            AND registration.semesterID = (SELECT TOP(1) semesterID FROM stt WHERE userId = '${userId}' ORDER BY STID DESC)
            `)
            .getRawMany()
            .then(results => {
                return results.map(result => {
                    if (!result["Grade"]) {
                        result["Grade"] = 'گزارش نشده'
                    }
                    result["exam_time"] = `${new Date(result.examDate).toLocaleDateString('fa-IR')} - ${result.examHour}`
                    return result
                })

            });
    }

    async findAllForTeacher(userId: number, COID: number) {

        return this.courseRegistrationRepository
            .createQueryBuilder('registration')
            .select([
                'registration.REID as id',
                'registration.RSTID as StudentID',
                'registration.RCOID as CourseID',
                'course.COTITLE as CourseName',
                `CONCAT(u.firstName,' ',u.lastName) as fullName`,
                'registration.semester as SemesterName',
                'registration.grade as Grade',
                'registration.isFinal as isFinal',
                'registration.createdAt as RegistrationDate',
            ])
            .innerJoin('registration.student', 'student')
            .innerJoin('registration.course', 'course')
            .innerJoin(User, 'u', 'u.id = student.userId')
            .innerJoin(Teachers, 't', 't.TEID = course.CTEID')
            .where(userId && `t.userId = ${userId}` + (!!COID ? `AND registration.RCOID = ${COID}` : ''))
            .getRawMany()
            .then(results => {

                return results.map(result => {
                    if (!result["Grade"]) {
                        result["Grade"] = 'گزارش نشده'
                        return result
                    } else {
                        return result
                    }
                });
            });
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
            .innerJoin('registration.student', 'student')
            .innerJoin('registration.course', 'course')
            .innerJoin('course.teachers', 'teachers')
            .where("registration.REID = :id", { id })
            .getRawOne();
    }

    async SetGrade(gradData: gradDto) {
        await this.courseRegistrationRepository.query(`
            UPDATE course_registration
            SET grade = ${gradData.value}
            WHERE RSTID = ${gradData.STID} AND RCOID = ${gradData.COID}
        `)
    }

    async getAllInfo(userId: number, semesterId: number) {
        const halfFinal = await this.courseRegistrationRepository.query(`
        SELECT SUM(c.CREDIT) as totallUnit_half_final,AVG(grade) as AvgGrade_half_final
        FROM course_registration cr
        JOIN stt s ON s.STID = cr.RSTID
        JOIN cot c ON c.COID = cr.RCOID
        JOIN [dbo].[user] u ON u.id = s.userId
        WHERE u.id = ${userId} AND isFinal = 'True' AND s.semesterID = ${semesterId}
        `)

        const halfGet = await this.courseRegistrationRepository.query(`
        SELECT SUM(c.CREDIT) as totallUnit_half_get
        FROM course_registration cr
        JOIN stt s ON s.STID = cr.RSTID
        JOIN cot c ON c.COID = cr.RCOID
        JOIN [dbo].[user] u ON u.id = s.userId
        WHERE u.id = ${userId} AND s.semesterID = ${semesterId}
        `)

        const totallGet = await this.courseRegistrationRepository.query(`
        SELECT SUM(c.CREDIT) as totallUnit
        FROM course_registration cr
        JOIN stt s ON s.STID = cr.RSTID
        JOIN cot c ON c.COID = cr.RCOID
        JOIN [dbo].[user] u ON u.id = s.userId
        WHERE u.id = 1011
        `)

        const totallFinal = await this.courseRegistrationRepository.query(`
        SELECT SUM(c.CREDIT) as totallUnit,AVG(grade) as AvgGrade
        FROM course_registration cr
        JOIN stt s ON s.STID = cr.RSTID
        JOIN cot c ON c.COID = cr.RCOID
        JOIN [dbo].[user] u ON u.id = s.userId
        WHERE u.id = 1011 AND isFinal = 'True' 
        `)


        return [...halfFinal, ...halfGet, ...totallFinal, ...totallGet]
    }

    async SetGradeFinal(gradData: gradDtoFinal) {
        await this.courseRegistrationRepository.query(`
            UPDATE course_registration
            SET isFinal = 'True'
            WHERE RSTID = ${gradData.STID} AND RCOID = ${gradData.COID}
        `)
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
