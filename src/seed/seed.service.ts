import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(private readonly productsServices: ProductsService) {}

  async runSeed() {
    await this.insertNewProducts();
    return 'SEED EXECUTED';
  }

  private async insertNewProducts() {
    await this.productsServices.deleteAllProducts();
    const products = initialData.products;
    const insertPromises = [];

    // products.forEach((product) => {
    //   // create resolv a promise with the product created
    //   insertPromises.push(this.productsServices.create(product));
    // });

     // wait for all the promises to be resolved
    await Promise.all(insertPromises);

    return true;
  }
}
