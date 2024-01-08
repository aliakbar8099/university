import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';

export const UserRole = {
    Student: 'student',
    Teacher: 'teacher',
    Admin: 'admin',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    nationalCode: string;

    @Column()
    phoneNumber: string;

    @Column()
    birthDate: Date;

    @Column()
    gender: string;

    @Column()
    password: string;

    @Column({
        type: 'varchar',
        length: 20,
        default: UserRole.Student,
    })

    role: string;

    async setPassword(newPassword: string): Promise<void> {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        this.password = await bcrypt.hash(newPassword, salt);
    }

    async comparePassword(candidatePassword: string): Promise<boolean> {
        return bcrypt.compare(candidatePassword, this.password);
    }
}