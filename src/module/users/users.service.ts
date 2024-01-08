import { Body, ForbiddenException, Injectable } from '@nestjs/common';
import { User, UserRole } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/user.dto';

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

    findOne(id: number): Promise<User | undefined> {
        const user = this.userRepository.findOne({ where: { id } })

        if (user) {
            return Promise.resolve(user)
        }

        return undefined
    }

}
