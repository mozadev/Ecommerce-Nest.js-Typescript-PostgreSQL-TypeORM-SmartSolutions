import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { initialData } from '../../seed/data/seed-data';
import { MinLength } from "class-validator";



@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text' ,{ unique: true })
    email: string;

    @MinLength(8)
    @Column('text', { select: false})
    password: string;

    @Column('text' ,{ unique: true })
    fullName: string;

    @Column('boolean' ,{ default: true })
    isActive: boolean;

    @Column('text', {
        array: true,
        default: ['user'],
    })
    roles: String[];

    @BeforeInsert()
    checkFielsBeforeInsert(){
        this.email = this.email.toLowerCase().trim();
    
    }

    @BeforeUpdate()
    checkFielsBeforeUpdate(){
        this.checkFielsBeforeInsert();
    }



    // @BeforeInsert()
    // async hashPassword() {
    //     this.password = await bcrypt.hash(this.password, 10);
    // }
}
