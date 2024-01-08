import { Body, ForbiddenException, Injectable, NotAcceptableException, NotFoundException, Req, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/users.entity';
import { sign } from 'jsonwebtoken';
import { verify } from 'jsonwebtoken';
import { CreateUserDto } from '../users/dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        @InjectRepository(RefreshToken)
        private readonly refreshTokenRepository: Repository<RefreshToken>,
    ) { }

    private async retrieveRefreshToken(
        refreshStr: string,
    ): Promise<RefreshToken | undefined> {
        try {
            const decoded = verify(refreshStr, process.env.REFRESH_SECRET);

            if (typeof decoded === 'string') {
                return undefined;
            }

            return await this.refreshTokenRepository.findOne(decoded.id);
        } catch (error) {
            return undefined;
        }
    }

    async createUserWithAccessToken(value: { userAgent: string; ipAddress: string }, @Body() userData: CreateUserDto): Promise<{ msg: string; accessToken: string, refreshToken: string } | NotAcceptableException> {
        // Validate the incoming data using the CreateUserDto
        const { role, phoneNumber, nationalCode } = userData;

        if (!!(await this.userService.findByNationalCode(nationalCode))) {
            return new NotAcceptableException("شماره شناسنامه قبلا ثبت شده")
        }

        if (!!(await this.userService.findByPhoneNumber(phoneNumber))) {
            return new NotAcceptableException("شماره همراه قبلا ثبت شده")
        }

        if (!Object.values(UserRole).includes(role)) {
            throw new ForbiddenException({ msg: "نقش کاربر نامعتبر است", roles: Object.values(UserRole) })
        }

        const user = await this.userService.create(userData);

        // Generate an access token
        const jwt = await this.newRefreshAndAccessToken(user, value);

        return { msg: "user create successfuly", accessToken: jwt.accessToken, refreshToken: jwt.refreshToken };
    }

    async refresh(refreshStr: string): Promise<string | undefined> {
        const refreshToken = await this.retrieveRefreshToken(refreshStr);

        if (!refreshToken) {
            return undefined;
        }

        const user = await this.userService.findOne(refreshToken.userId);

        if (!user) {
            return undefined;
        }

        const accessToken = {
            userId: refreshToken.userId,
        };

        return sign(accessToken, process.env.ACCESS_SECRET, { expiresIn: '1h' });
    }

    async login(
        nationalCode: string,
        password: string,
        value: { userAgent: string; ipAddress: string },
    ): Promise<{ accessToken: string; refreshToken: string } | undefined | NotFoundException> {
        const user = await this.userService.findByNationalCode(nationalCode);

        if (!user) {
            throw new UnauthorizedException("نام کاربری یا رمز عبور اشتباه است !");
        }

        const passwordConfrim = await bcrypt.compare(password, user.password);

        if (!passwordConfrim) {
            throw new UnauthorizedException("نام کاربری یا رمز عبور اشتباه است !");
        }

        return this.newRefreshAndAccessToken(user, value);
    }

    async newRefreshAndAccessToken(
        user: User,
        values: { userAgent: string; ipAddress: string },
    ): Promise<{ accessToken: string; refreshToken: string }> {
        const refreshObject = new RefreshToken(user.id, values.userAgent, values.ipAddress);

        const savedRefreshToken = await this.refreshTokenRepository.save(refreshObject);

        return {
            refreshToken: savedRefreshToken.sign(),
            accessToken: sign(
                { userId: user.id, role: user.role },
                process.env.ACCESS_SECRET,
                { expiresIn: '1h' },
            ),
        };
    }

    async logout(refreshStr: string): Promise<void> {
        const refreshToken = await this.retrieveRefreshToken(refreshStr);

        if (!refreshToken) return;

        // delete refresh token from db
        await this.refreshTokenRepository.delete(refreshToken.id);
    }
}
