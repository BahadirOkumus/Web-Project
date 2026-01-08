import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categories: CategoriesService) {}

  @Get()
  list() {
    return this.categories.findAllPublic();
  }

  @Get(':id/products')
  products(@Param('id', ParseIntPipe) id: number) {
    return this.categories.findProductsByCategory(id);
  }
}
