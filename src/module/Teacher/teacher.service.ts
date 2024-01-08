import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teachers } from './teacher.entity';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TeachersDto } from './dto/teacher.dto';
import { User } from '../users/users.entity';
import { FieldStudy } from '../FieldStudy/field.entity';
import { College } from '../College/College.entity';

@Injectable()
export class TeachersService {
    constructor(
        @InjectRepository(Teachers)
        private readonly TeachersRepository: Repository<Teachers>,
    ) { }

    @ApiOperation({ summary: 'Create a new' })
    @ApiResponse({ status: 201, description: 'successfully created.' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiBody({ type: TeachersDto })
    async create(TeachersData: TeachersDto): Promise<Teachers> {
        const Teacher = this.TeachersRepository.create(TeachersData);
        return await this.TeachersRepository.save(Teacher);
    }

    async findAll(): Promise<any[]> {
        const teacherDetails = await this.TeachersRepository
        .createQueryBuilder("t")
        .select([
            "TEID",
            "TETITLE",
            "graduationYear",
            "TELEV",
            "firstName",
            "lastName",
            "birthDate",
            "gender",
            'CollegeName',
            'FSName',
        ])
        .innerJoin(FieldStudy, 'f', 't.fieldStudyId = f.FSID')
        .innerJoin(College, 'u', 'f.STEID = u.UniversityID')
        .innerJoin(User, 'us', 't.userId = us.id')
        .getRawMany()

        return teacherDetails;
    }

    async findOne(id: number): Promise<Teachers> {
        const Teacher = await this.TeachersRepository.findOne({
            where: { TEID: id },
        });

        return Teacher;
    }


    async update(id: number, TeacherData: Partial<Teachers>): Promise<Teachers> {
        await this.TeachersRepository.findOne({
            where: { TEID: id },
        }); // Check if exists
        await this.TeachersRepository.update(id, TeacherData);
        return await this.TeachersRepository.findOne({
            where: { TEID: id },
        });
    }

    /*
      DELETE FROM Teachers WHERE TEID = @COID;
    */
    async remove(id: number): Promise<void> {
        const Teacher = await this.TeachersRepository.findOne({
            where: { TEID: id },
        });
        await this.TeachersRepository.remove(Teacher);
    }

}
