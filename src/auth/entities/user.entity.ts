import { BeforeInsert, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { initialData } from '../../seed/data/seed-data';
import { MinLength } from "class-validator";



@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text' ,{ unique: true })
    email: string;

    @MinLength(8)
    @Column('text')
    password: string;

    @Column('text' ,{ unique: true })
    fullname: string;

    @Column('boolean' ,{ unique: true })
    isActive: boolean;

    @Column('text', {
        array: true,
        default: ['user'],
    })
    roles: String[];

    // @BeforeInsert()
    // async hashPassword() {
    //     this.password = await bcrypt.hash(this.password, 10);
    // }
}
