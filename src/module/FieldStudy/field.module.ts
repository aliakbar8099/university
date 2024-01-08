import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FieldStudyController } from './field.controller';
import { FieldStudy } from './field.entity';
import { FieldStudyService } from './field.service';

@Module({
    imports: [TypeOrmModule.forFeature([FieldStudy])],
    providers: [FieldStudyService],
    controllers: [FieldStudyController],
})
export class FieldStudyModule { }
