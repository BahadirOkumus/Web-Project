import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  list() {
    return this.products.findAllPublic();
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.products.findOnePublic(id);
  }

  @Get(':id/reviews')
  getReviews(@Param('id', ParseIntPipe) id: number) {
    return this.products.findProductReviews(id);
  }
}
