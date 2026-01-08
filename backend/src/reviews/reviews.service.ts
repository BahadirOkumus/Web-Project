import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private readonly reviewsRepo: Repository<Review>,
    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  async create(userId: number, dto: CreateReviewDto) {
    const product = await this.productsRepo.findOne({
      where: { id: dto.productId },
    });
    if (!product) throw new NotFoundException('Product not found');
    const review = this.reviewsRepo.create({
      user: { id: userId } as User,
      product,
      rating: dto.rating,
      comment: dto.comment,
    });
    return this.reviewsRepo.save(review);
  }

  async update(userId: number, id: number, dto: UpdateReviewDto) {
    const review = await this.reviewsRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!review) throw new NotFoundException('Review not found');
    if (review.user.id !== userId) throw new ForbiddenException();
    Object.assign(review, dto);
    return this.reviewsRepo.save(review);
  }

  async remove(userId: number, id: number) {
    const review = await this.reviewsRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!review) throw new NotFoundException('Review not found');
    if (review.user.id !== userId) throw new ForbiddenException();
    await this.reviewsRepo.remove(review);
    return { deleted: true };
  }

  my(userId: number) {
    return this.reviewsRepo.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });
  }
}
