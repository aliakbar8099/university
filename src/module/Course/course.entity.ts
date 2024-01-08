import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { FieldStudy } from '@/module/FieldStudy/field.entity';
import { Teachers } from '../Teacher/teacher.entity';

@Entity()
export class COT {
  @PrimaryGeneratedColumn()
  COID: number;

  @Column()
  COTITLE: string;

  @Column()
  COTYPE: string;

  @Column()
  CREDIT: number;

  @Column()
  CFSID: number;

  @ManyToOne(() => FieldStudy)
  @JoinColumn({ name: 'CFSID' })
  fieldStudy: FieldStudy;

  @Column()
  CTEID: number;

  @ManyToOne(() => Teachers)
  @JoinColumn({ name: 'CTEID' })
  teachers: Teachers;
}


