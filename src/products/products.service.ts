import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

import { Product, ProductImage } from './entities';
import { validate as isUUID } from 'uuid';
import { title } from 'process';
import { query } from 'express';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');
  // this repository not only is useful to insert sino to do all the operations with the database(querybuilder, etc)
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    // it knows how to connect to the database, and user that I use to connect to the database, and it has the same repository's configurations
    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const { imagesDto = [], ...productDetails } = createProductDto;

      // create register in memory
      const product = this.productRepository.create({
        ...productDetails,
        imagesEntityProduct: imagesDto.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
      });

      // save in database
      await this.productRepository.save(product);

      return { ...product, imagesEntityProduct: imagesDto };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,

      // TODO: relations
      relations: {
        imagesEntityProduct: true,
      },
    });
    //desestructuring arguments
    return products.map(({ imagesEntityProduct, ...rest }) => ({
      ...rest,
      imagesEntityProduct: imagesEntityProduct.map((image) => image.url),
    }));

    // return products.map((product) => ({
    //   ...product,
    //   imagesEntityProduct: product.imagesEntityProduct.map((img) => img.url),
    // }));
  }

  // async findOne(id: string) {
  //   const product = await this.productRepository.findOneBy({ id });
  //   if (!product)
  //     throw new NotFoundException(`Product with id  ${id} not found`);
  //   return product;
  // }

  async findOne(term: string) {
    let product: Product;

    if (isUUID(term)) {
      // product = await this.productRepository.findOne({
      //   where: { id: term },
      //   relations: { imagesEntityProduct: true },
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      // product = await this.productRepository.findOneBy({ slug: term });
      // const queryBuilder = this.productRepository.createQueryBuilder();
      // product = await queryBuilder
      //   .where('title ILIKE :term OR slug ILIKE :term', {
      //     term: `%${term}%`,
      //   })
      //   .getOne();

      // You can omit 'prod' alias, but you need to use the entity name
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where('UPPER(title) = :title OR slug = :slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('prod.imagesEntityProduct', 'prodImages')
        // prod images is the alias of the relation
        // .leftJoinAndSelect('Product.imagesEntityProduct', 'alias')
        .getOne();
    }

    //   const product = await this.productRepository.findOneBy({ id });

    if (!product)
      throw new NotFoundException(`Product with id  ${term} not found`);
    // return {...product , imagesEntityProduct: product.imagesEntityProduct.map((img) => img.url)};
    return product;
  }

  async findOnePlain(term: string) {
    const { imagesEntityProduct = [], ...rest } = await this.findOne(term);
    return {
      ...rest,
      imagesEntityProduct: imagesEntityProduct.map((image) => image.url),
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    // load all properties of the entity with ... updateProductDto, this
    // doesn't update the entity in the database only prepare the entity to be updated

    const { imagesDto, ...toUpdate } = updateProductDto;

    const product = await this.productRepository.preload({
      id,
      ...toUpdate,
      // id: id, // redundant in EMACScript6
      // ...updateProductDto,
      // imagesEntityProduct: [],
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    // create query runner, this have to know conection's string to the database
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (imagesDto) {
        // delete all images
        await queryRunner.manager.delete(ProductImage, { product: { id } });

        product.imagesEntityProduct = imagesDto.map((image) =>
          this.productImageRepository.create({ url: image }),
        );
      } else {
      }
      await queryRunner.manager.save(product);
      // await this.productRepository.save(product);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      // return product;
      return this.findOnePlain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    // console.log(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
