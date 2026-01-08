import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Review } from '../reviews/review.entity';
import { Role } from '../common/role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Index({ unique: true })
  @Column()
  email: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'text', default: Role.CUSTOMER })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
}
