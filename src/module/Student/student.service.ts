// student.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { STT as Student } from '@/module/Student/student.entity';
import { College } from '@/module/College/College.entity';
import { FieldStudy } from '@/module/FieldStudy/field.entity';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StudentDto } from './dto/student.dto';
import { User } from '../users/users.entity';
import { Semester } from '../Semester/semester.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) { }

  /*
    INSERT INTO STT (STNAME, STLEV, STMJR, STEID)
    VALUES (@STNAME, @STLEV, @STMJR, @STEID);
  */
  @ApiOperation({ summary: 'Create a new student' })
  @ApiResponse({ status: 201, description: 'The student has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: StudentDto })
  async create(studentData: StudentDto): Promise<Student> {
    const student = this.studentRepository.create(studentData);
    return await this.studentRepository.save(student);
  }

  /*
    SELECT
      s.STID,
      s.STNAME,
      s.STLEV,
      s.STMJR,
      u.CollegeName,
      f.FSName
    FROM
      STT s
    JOIN
      College u ON s.FSID = f.FSID
    JOIN
      FieldStudy f ON s.FSID = f.FSID;
  */
  async findAllStudentsWithDetails(userId?: number): Promise<any[]> {
    const studentDetails = await this.studentRepository
      .createQueryBuilder('s')
      .select([
        "STID as id",
        "firstName",
        "lastName",
        "STLEV",
        "birthDate",
        "gender",
        'CollegeName',
        'FSName',
        "name as semesterName",
        "us.id as userId"
      ])
      .innerJoin(FieldStudy, 'f', 's.FSID = f.FSID')
      .innerJoin(College, 'u', 'f.fk_CollegeID = u.CollegeID')
      .innerJoin(Semester, 'se', 's.semesterID = se.semesterId')
      .innerJoin(User, 'us', 's.userId = us.id')
      .where(userId && `s.userId = ${userId}`)
      .getRawMany();

    return studentDetails;
  }

  async findAllUserTerm(userId?: number): Promise<any> {
    const terms = await this.studentRepository
      .query(`
      SELECT userId, COUNT(userId) AS term
      FROM stt
      where userId = ${userId}
      GROUP BY userId`)

    return terms[0] ?? {};
  }

  /*
    SELECT
      s.STID,
      s.STNAME,
      s.STLEV,
      s.STMJR,
      u.CollegeName,
      f.FSName
    FROM
      STT s
    JOIN
      College u ON s.FSID = f.FSID
    JOIN
      FieldStudy f ON s.FSID = f.FSID
    WHERE
      s.STID = @STID;
  */
  async findOneStudentWithDetails(id: number): Promise<any> {
    const student = await this.studentRepository
      .createQueryBuilder('s')
      .select([
        "STID as id",
        "firstName",
        "lastName",
        "STLEV",
        "birthDate",
        "gender",
        'CollegeName',
        'FSName',
        "name as semesterName"
      ])
      .innerJoin(FieldStudy, 'f', 's.SFSID = f.FSID')
      .innerJoin(College, 'u', 'f.fk_CollegeID = u.CollegeID')
      .innerJoin(Semester, 'se', 's.semesterID = se.semesterId')
      .innerJoin(User, 'us', 's.userId = us.id')
      .where("s.STID = :id", { id })
      .getRawOne();

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return student;
  }
  /*
    UPDATE STT
    SET STNAME = @STNAME, STLEV = @STLEV, STMJR = @STMJR
    WHERE STID = @STID;
  */
  async update(id: number, studentData: Partial<Student>): Promise<Student> {
    await this.studentRepository.findOne({
      where: { STID: id },
    }); // Check if the student exists
    await this.studentRepository.update(id, studentData);
    return await this.studentRepository.findOne({
      where: { STID: id },
    });
  }

  /*
    DELETE FROM STT WHERE STID = @STID;
  */
  async remove(id: number): Promise<void> {
    const student = await this.studentRepository.findOne({
      where: { STID: id },
    });
    await this.studentRepository.remove(student);
  }

}
