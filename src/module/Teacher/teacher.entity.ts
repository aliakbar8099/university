import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne, OneToMany, ManyToMany } from 'typeorm';
import { User } from '../users/users.entity';
import { FieldStudy } from '../FieldStudy/field.entity';

@Entity()
export class Teachers {
  @PrimaryGeneratedColumn()
  TEID: number;

  @Column()
  TETITLE: string; 

  @Column()
  TELEV: string; 

  @Column({ type: "varchar", length: 4 })
  graduationYear: string; 

  @Column()
  userId: number; 

  @Column()
  fieldStudyId: number; 

  @ManyToOne(() => FieldStudy)
  @JoinColumn({ name: 'fieldStudyId' })
  field_study: FieldStudy;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}