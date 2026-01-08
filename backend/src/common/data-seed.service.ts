import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { Role } from './role.enum';

@Injectable()
export class DataSeedService {
  private readonly logger = new Logger(DataSeedService.name);

  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  async onModuleInit() {
    const email = 'admin@minishop.com';
    const existing = await this.usersRepo.findOne({ where: { email } });
    if (existing) {
      if (existing.role !== Role.ADMIN) {
        existing.role = Role.ADMIN;
        await this.usersRepo.save(existing);
        this.logger.log('Admin role ensured for existing admin user');
      }
      return;
    }
    const passwordHash = await bcrypt.hash('Admin1234!', 10);
    const admin = this.usersRepo.create({
      name: 'Admin',
      email,
      passwordHash,
      role: Role.ADMIN,
    });
    await this.usersRepo.save(admin);
    this.logger.log('Admin user seeded');
  }
}
