import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  title: string;

  // if this were a interface, we couldn't create decorators.
  @Column('float', {
    default: 0,
  })
  price: number;

  //other form to define a column
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    unique: true,
  })
  slug: string;

  @Column('int', {
    default: 0,
  })
  stock: number;

  @Column('text', {
    array: true,
  })
  sizes: string[];

  @Column('text')
  gender: string;
}
