import { Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { initialData } from '../../seed/data/seed-data';


@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    email: string;

    password: string;

    fullname: string;

    isActive: boolean;

    roles: String[];
}
