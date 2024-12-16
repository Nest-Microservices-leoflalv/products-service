import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  readonly #logger = new Logger('ProductsService');

  async onModuleInit() {
    await this.$connect();
    this.#logger.log('Database connected');
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const total = await this.product.count();
    const lastPage = Math.ceil(total / limit);
    const data = await this.product.findMany({
      where: {
        available: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      total,
      last_page: lastPage,
      page,
      data,
    };
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: {
        id,
        available: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with id "${id}" not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: _, ...data } = updateProductDto;

    try {
      const product = await this.product.update({
        where: {
          id,
          available: true,
        },
        data,
      });
      return product;
    } catch (_) {
      throw new NotFoundException(`Product with id "${id}" not found`);
    }
  }

  async remove(id: number) {
    try {
      await this.product.update({
        where: {
          id,
          available: true,
        },
        data: {
          available: false,
        },
      });
    } catch (_) {
      throw new NotFoundException(`Product with id "${id}" not found`);
    }
  }
}
