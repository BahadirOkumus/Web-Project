import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Check,
} from 'typeorm';
import { Category } from '../categories/category.entity';
import { Review } from '../reviews/review.entity';

@Entity()
@Check('price >= 0')
@Check('stock >= 0')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'real' })
  price: number;

  @Column({ type: 'integer' })
  stock: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Category, (category) => category.products, {
    cascade: true,
  })
  @JoinTable()
  categories: Category[];

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];
}
