import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { Role } from '../common/role.enum';
import { SetProductCategoriesDto } from './dto/set-product-categories.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join, extname } from 'path';
import { existsSync, mkdirSync } from 'fs';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/products')
export class AdminProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  list() {
    return this.products.adminFindAll();
  }

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.products.adminCreate(dto);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const dir = join(process.cwd(), 'uploads');
          if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          const name = `${Date.now()}-${Math.random().toString(16).slice(2)}${ext}`;
          cb(null, name);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  upload(@UploadedFile() file: any) {
    return { url: `/uploads/${file.filename}` };
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.products.adminUpdate(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.products.adminDelete(id);
  }

  @Patch(':id/categories')
  setCategories(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: SetProductCategoriesDto,
  ) {
    return this.products.adminSetCategories(id, body.categoryIds);
  }
}
