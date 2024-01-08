import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { COT } from '@/module/Course/course.entity';

@Entity()
export class PREREQ {
    @PrimaryGeneratedColumn()
    PREID: number;
    
    @Column()
    COID: number;
    
    @ManyToOne(() => COT)
    @JoinColumn({ name: 'COID' })
    course: COT;

    @Column()
    PRECOID: number;

    @ManyToOne(() => COT)
    @JoinColumn({ name: 'PRECOID' })
    preCourse: COT;
}
