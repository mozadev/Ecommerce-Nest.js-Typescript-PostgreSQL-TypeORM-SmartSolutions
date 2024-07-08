import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsServices: ProductsService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async runSeed() {

    await this.deleteTables();
    const adminUser_firsUser = await this.insertUsers();  

    await this.insertNewProducts(adminUser_firsUser);

    return 'SEED EXECUTED';
  }

  private async deleteTables() {
    // since we have cascading  on the products, it will automatically delete the images
    await this.productsServices.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({})
      .execute();
  }

  private async insertUsers() {
    const seedUsers = initialData.users;

    const users: User[] = [];

    // prepare the users to be inserted
    seedUsers.forEach(user => {
      users.push(this.userRepository.create(user));
    })
    // insert the users in the database
    await this.userRepository.save(users);
    //const dbUsers = await this.userRepository.save(seedUsers); wrong
    
    //return dbUsers[0]; wrong
    return users[0];
  }

  private async insertNewProducts(user: User) {
    await this.productsServices.deleteAllProducts();
    const products = initialData.products;
    const insertPromises = [];

    products.forEach((product) => {
      // create resolv a promise with the product created
      insertPromises.push(this.productsServices.create(product, user));
    });

    // wait for all the promises to be resolved
    await Promise.all(insertPromises);

    return true;
  }
}
