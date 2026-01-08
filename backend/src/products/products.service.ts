import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from './product.entity';
import { Category } from '../categories/category.entity';
import { Review } from '../reviews/review.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoriesRepo: Repository<Category>,
    @InjectRepository(Review) private readonly reviewsRepo: Repository<Review>,
  ) {}

  findAllPublic() {
    return this.productsRepo.find({ relations: ['categories'] });
  }

  async findOnePublic(id: number) {
    const product = await this.productsRepo.findOne({
      where: { id },
      relations: ['categories', 'reviews', 'reviews.user'],
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findProductReviews(productId: number) {
    const product = await this.productsRepo.findOne({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');
    return this.reviewsRepo.find({
      where: { product: { id: productId } },
      relations: ['user'],
    });
  }

  adminFindAll() {
    return this.productsRepo.find({ relations: ['categories'] });
  }

  async adminCreate(dto: CreateProductDto) {
    const entity = this.productsRepo.create(dto);
    return this.productsRepo.save(entity);
  }

  async adminUpdate(id: number, dto: UpdateProductDto) {
    const product = await this.productsRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    Object.assign(product, dto);
    return this.productsRepo.save(product);
  }

  async adminDelete(id: number) {
    const product = await this.productsRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    await this.productsRepo.remove(product);
    return { deleted: true };
  }

  async adminSetCategories(id: number, categoryIds: number[]) {
    const product = await this.productsRepo.findOne({
      where: { id },
      relations: ['categories'],
    });
    if (!product) throw new NotFoundException('Product not found');
    const categories = await this.categoriesRepo.find({
      where: { id: In(categoryIds) },
    });
    if (categories.length !== categoryIds.length)
      throw new NotFoundException('Some categories not found');
    product.categories = categories;
    return this.productsRepo.save(product);
  }
}
