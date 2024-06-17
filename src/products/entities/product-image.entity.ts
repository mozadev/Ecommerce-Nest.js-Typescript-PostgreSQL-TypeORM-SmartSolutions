import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  url: string;

  @ManyToOne(() => Product, (product) => product.imagesEntityProduct, {
    onDelete: 'CASCADE',
  })
  product: Product;
}

// the properties image of product contains inverse
// relation to  productImage entity
