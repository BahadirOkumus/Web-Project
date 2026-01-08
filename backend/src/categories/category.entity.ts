import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  Index,
} from 'typeorm';
import { Product } from '../products/product.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  name: string;

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];
}
