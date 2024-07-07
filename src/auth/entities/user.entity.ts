import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { MinLength } from "class-validator";
import { Product } from "../../products/entities";



@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', { unique: true })
    email: string;

    @MinLength(8)
    @Column('text', { select: false })
    password: string;

    @Column('text', { unique: true })
    fullName: string;

    @Column('boolean', { default: true })
    isActive: boolean;

    @Column('text', {
        array: true,
        default: ['user'],
    })
    roles: String[];



    @OneToMany(
        // it will be related to the product entity 
        () => Product,
        // how does this product how to interact with the user entity
        (product) => product.user
    )
    product: Product


    @BeforeInsert()
    checkFielsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();

    }

    @BeforeUpdate()
    checkFielsBeforeUpdate() {
        this.checkFielsBeforeInsert();
    }



    // @BeforeInsert()
    // async hashPassword() {
    //     this.password = await bcrypt.hash(this.password, 10);
    // }
}
