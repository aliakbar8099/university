import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollegeController } from './College.controller';
import { College } from './College.entity';
import { CollegeService } from './College.service';

@Module({
    imports: [TypeOrmModule.forFeature([College])],
    providers: [CollegeService],
    controllers: [CollegeController],
})
export class CollegeModule { }
