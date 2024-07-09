import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { ProductImage } from './product-image.entity';
import { User } from '../../auth/entities/user.entity';

@Entity({ name: 'products' })
export class Product {

  @ApiProperty(
    {
      example: '319ca805-f3f6-453d-b970-ef5ebcafcbef',
      description: 'Product id',
      uniqueItems: true,
    })
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @ApiProperty(
    {
      example: 'T-Shirt Smart',
      description: 'Product Title',
      uniqueItems: true,
    }
  )
  @Column('text', {
    unique: true,
  })
  title: string;

  // if this were a interface, we couldn't create decorators.

  @ApiProperty(
    {
      example: 0,
      description: 'Product Price',
    }
  )
  @Column('float', {
    default: 0,
  })
  price: number;

  //other form to define a column

  @ApiProperty(
    {
      example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec.',
      description: 'Product Description',
      default: null,
    }
  )
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;


  @ApiProperty(
    {
      example: 'T-Shirt_Smart',
      description: 'Product Title',
      default: true,
    }
  )
  @Column({
    unique: true,
  })
  slug: string;


  @ApiProperty({
    example: 10,
    description: 'Product Stock',
    default: 0,
  })
  @Column('int', {
    default: 0,
  })
  stock: number;


  @ApiProperty(
    {
      example: ['S', 'M', 'L', 'XL'],
      description: 'Product Size',
    }
  )
  @Column('text', {
    array: true,
  })
  sizes: string[];



  @ApiProperty({
    example: 'women',
    description: 'Product Gender',
  })
  @Column('text')
  gender: string;


  @ApiProperty()
  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  // images
  // the properties product of productImage contains inverse
  // relation product entity

  @ApiProperty()
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];


  //@ApiProperty() // we haven't got the relation directly 
  @ManyToOne(
    // it will be related to the user entity 
    () => User,
    // how does this user how to interact with the product entity
    (user) => user.product,
    { eager: true }
  )
  user: User;
  // type set the idUser automatically and save the relation

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    if (!this.slug) {
      this.slug = this.title;
    }
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
