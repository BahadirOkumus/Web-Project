import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { ConfigService } from '@nestjs/config';
import { Role } from '../common/role.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    config: ConfigService,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        const auth = req.headers.authorization;
        if (!auth) return null;
        const parts = auth.split(' ');
        if (parts.length !== 2) return null;
        const [type, token] = parts;
        if (type !== 'Bearer') return null;
        return token;
      },
      ignoreExpiration: false,
      secretOrKey:
        config.get<string>('JWT_SECRET') ?? 'devsecret_change_in_prod',
    });
  }

  async validate(payload: { sub: number; email: string; role: Role }) {
    const user = await this.usersRepo.findOne({ where: { id: payload.sub } });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
