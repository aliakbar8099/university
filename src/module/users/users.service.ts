import { Body, ForbiddenException, Injectable } from '@nestjs/common';
import { User, UserRole } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, CreateUserDtoWithoutPassword } from './dto/user.dto';

@Injectable()
export class UsersService {
    private users: User[] = [];

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async create(@Body() userData: CreateUserDto): Promise<User> {
        const { role } = userData;

        if (!Object.values(UserRole).includes(role)) {
            throw new ForbiddenException({ msg: "نقش کاربر نامعتبر است", roles: Object.values(UserRole) })
        }

        const user = this.userRepository.create(userData);
        await user.setPassword(userData.password)
        return await this.userRepository.save(user);
    }

    async createWithoutPassword(@Body() userData: CreateUserDtoWithoutPassword): Promise<any> {
        const { role } = userData;

        if (!Object.values(UserRole).includes(role)) {
            throw new ForbiddenException({ msg: "نقش کاربر نامعتبر است", roles: Object.values(UserRole) })
        }

        const user = this.userRepository.create(userData);
        await user.setPassword(userData.phoneNumber)
        return await this.userRepository.save(user);
    }

    async findAll(page: number = 1, itemsPerPage: number = 12, searchTerm: string = "", role: string = "", gender: string = ""): Promise<User[]> {
        const offset = (page - 1) * itemsPerPage;

        const firstNameSearch = `u.firstName LIKE N'%${searchTerm.split(" ")[0]}%'`;
        const lastNameSearch = searchTerm.split(" ")[1] ? `u.lastName LIKE N'%${searchTerm.split(" ")[1]}%'` : '1=1';

        return await this.userRepository
            .createQueryBuilder("u")
            .select([
                "id",
                "firstName",
                "lastName",
                "nationalCode",
                "phoneNumber",
                "birthDate",
                "gender",
                "role"
            ])
            .where(`u.role LiKE '%${role}%' AND u.gender LiKE '%${gender}%' AND ${firstNameSearch} AND ${lastNameSearch}`)
            .offset(offset)
            .limit(itemsPerPage)
            .getRawMany()
            .then(results => {
                return results.map(result => {
                    if (result.gender.toLowerCase() === 'female') {
                        result.gender = 'زن';
                    } else if (result.gender.toLowerCase() === 'male') {
                        result.gender = 'مرد';
                    }

                    if (result.role.toLowerCase() === 'teacher') {
                        result.role = 'استاد';
                    } else if (result.role.toLowerCase() === 'student') {
                        result.role = 'دانشجو';
                    } else if (result.role.toLowerCase() === 'admin') {
                        result.role = 'مدیر سیستم';
                    }
                    return result;
                });
            });
    }

    findByNationalCode(nationalCode: string): Promise<User | undefined> {
        const user = this.userRepository.findOne({ where: { nationalCode } })

        if (user) {
            return Promise.resolve(user)
        }

        return undefined
    }

    findByPhoneNumber(phoneNumber: string): Promise<User | undefined> {
        const user = this.userRepository.findOne({ where: { phoneNumber } })

        if (user) {
            return Promise.resolve(user)
        }

        return undefined
    }

    async findAllSemesterByUser(userId?: number): Promise<any> {
        const data = await this.userRepository
            .query(`
          SELECT 
          semester.semesterID as semesterID,
          name
          FROM stt , semester
          WHERE stt.semesterID = semester.semesterId
          AND userId = ${userId}`)

        return data;
    }


    findOne(id: number): Promise<User | undefined> {
        const user = this.userRepository.findOne({ where: { id } })

        if (user) {
            return Promise.resolve(user)
        }

        return undefined
    }

}
