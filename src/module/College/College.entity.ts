import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class College {
  @PrimaryGeneratedColumn()
  CollegeID: number;

  @Column({ length: 255 })
  CollegeName: string;
}
