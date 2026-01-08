import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from '../common/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  adminFindAll() {
    return this.usersRepo.find({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      order: { id: 'ASC' },
    });
  }

  async adminSetRole(id: number, role: Role) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    user.role = role;
    await this.usersRepo.save(user);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  async adminDelete(id: number) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    await this.usersRepo.delete(id);
    return { success: true };
  }
}
