import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  title: string;

  @Column('numeric', {
    default: 0,
  })
  price: number;
}
