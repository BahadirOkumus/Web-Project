import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { Role } from '../common/role.enum';
import { SetUserRoleDto } from './dto/set-user-role.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  list() {
    return this.users.adminFindAll();
  }

  @Patch(':id/role')
  setRole(@Param('id', ParseIntPipe) id: number, @Body() dto: SetUserRoleDto) {
    return this.users.adminSetRole(id, dto.role);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.users.adminDelete(id);
  }
}
