import { Entity } from "typeorm";
import { initialData } from '../../seed/data/seed-data';


@Entity('users')
export class User {
    id: string;
}
