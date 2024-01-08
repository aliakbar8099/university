
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { FieldStudy } from '@/module/FieldStudy/field.entity';
import { Semester } from '../Semester/semester.entity';
import { User } from '../users/users.entity';

@Entity()
export class STT {
  @PrimaryGeneratedColumn()
  STID: number;
  
  @Column()
  STLEV: string;

  @Column()
  SFSID: number;

  @Column()
  userId: number;

  @ManyToOne(() => FieldStudy)
  @JoinColumn({ name: 'FSID' })
  fieldStudy: FieldStudy;

  @Column()
  semesterID: number;

  @ManyToOne(() => Semester)
  @JoinColumn({ name: 'semesterID' })
  semester: Semester;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}


