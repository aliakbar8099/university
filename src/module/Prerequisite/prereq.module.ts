import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrereqService } from "./prereq.service";
import { PrereqController } from './prereq.controller';
import { PREREQ } from './prereq.entity';
import { COT } from '../Course/course.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PREREQ, COT])],
    providers: [PrereqService],
    controllers: [PrereqController],
})
export class PrereqModule { }
