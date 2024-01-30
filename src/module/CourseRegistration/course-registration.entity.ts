import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, BeforeInsert } from 'typeorm';
import { STT } from '../Student/student.entity';
import { COT } from '../Course/course.entity';
import { Semester } from '../Semester/semester.entity';
import { PREREQ } from '../Prerequisite/prereq.entity';

@Entity()
export class CourseRegistration {
    @PrimaryGeneratedColumn()
    REID: number;

    @Column()
    RSTID: number;

    @Column()
    RCOID: number;

    @ManyToOne(() => STT)
    @JoinColumn({ name: 'RSTID' })
    student: STT;

    @ManyToOne(() => COT)
    @JoinColumn({ name: 'RCOID' })
    course: COT;

    @Column()
    semesterID: number;

    @ManyToOne(() => Semester)
    @JoinColumn({ name: 'semesterID' })
    semester: Semester;

    @Column('decimal', { precision: 4, scale: 2, default: null })
    grade: number;

    @Column({ default: false })
    isFinal: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @BeforeInsert()
    setDefaultGrade() {
        this.grade = null;
    }
}
