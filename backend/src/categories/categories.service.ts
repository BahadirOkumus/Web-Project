import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepo: Repository<Category>,
  ) {}

  findAllPublic() {
    return this.categoriesRepo.find();
  }

  async findProductsByCategory(id: number) {
    const cat = await this.categoriesRepo.findOne({
      where: { id },
      relations: ['products', 'products.categories'],
    });
    if (!cat) throw new NotFoundException('Category not found');
    return cat.products;
  }

  adminFindAll() {
    return this.categoriesRepo.find();
  }

  async adminCreate(dto: CreateCategoryDto) {
    try {
      const cat = this.categoriesRepo.create(dto);
      return await this.categoriesRepo.save(cat);
    } catch {
      throw new ConflictException('Category name must be unique');
    }
  }

  async adminUpdate(id: number, dto: UpdateCategoryDto) {
    const cat = await this.categoriesRepo.findOne({ where: { id } });
    if (!cat) throw new NotFoundException('Category not found');
    Object.assign(cat, dto);
    try {
      return await this.categoriesRepo.save(cat);
    } catch {
      throw new ConflictException('Category name must be unique');
    }
  }

  async adminDelete(id: number) {
    const cat = await this.categoriesRepo.findOne({ where: { id } });
    if (!cat) throw new NotFoundException('Category not found');
    await this.categoriesRepo.remove(cat);
    return { deleted: true };
  }
}
