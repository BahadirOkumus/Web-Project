import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Product } from './products/product.entity';
import { Category } from './categories/category.entity';
import { Review } from './reviews/review.entity';
import { AuthModule } from './auth/auth.module';
import { DataSeedService } from './common/data-seed.service';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { ReviewsModule } from './reviews/reviews.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Product, Category, Review],
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
    AuthModule,
    ProductsModule,
    CategoriesModule,
    ReviewsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, DataSeedService],
})
export class AppModule {}
