import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Semester {
  @PrimaryGeneratedColumn()
  semesterId: number;

  @Column({ length: 50 })
  name: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;
}
