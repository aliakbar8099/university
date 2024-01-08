import { College } from '@/module/College/College.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class FieldStudy {
  @PrimaryGeneratedColumn()
  FSID: number;

  @Column({ length: 255 })
  FSName: string;

  @Column()
  STEID: number;

  @ManyToOne(() => College)
  @JoinColumn({ name: 'STEID' })
  university: College;
}
