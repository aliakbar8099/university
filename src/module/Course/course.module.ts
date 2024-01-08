import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { COT } from './course.entity';
import { CotService } from './course.service';
import { courseController } from './course.controller';

@Module({
    imports: [TypeOrmModule.forFeature([COT])],
    providers: [CotService],
    controllers: [courseController],
})
export class courseModule { }
