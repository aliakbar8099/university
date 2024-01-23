import { College } from '@/module/College/College.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class FieldStudy {
  @PrimaryGeneratedColumn()
  FSID: number;

  @Column({ length: 255 })
  FSName: string;

  @Column()
  fk_CollegeID: number;

  @ManyToOne(() => College)
  @JoinColumn({ name: 'fk_CollegeID' })
  College: College;
}
