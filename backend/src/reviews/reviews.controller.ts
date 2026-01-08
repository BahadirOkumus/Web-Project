import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';
import type { User } from '../users/user.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@UseGuards(JwtAuthGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviews: ReviewsService) {}

  @Post()
  create(@Req() req: Request & { user?: User }, @Body() dto: CreateReviewDto) {
    return this.reviews.create(req.user!.id, dto);
  }

  @Patch(':id')
  update(
    @Req() req: Request & { user?: User },
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.reviews.update(req.user!.id, id, dto);
  }

  @Delete(':id')
  remove(
    @Req() req: Request & { user?: User },
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.reviews.remove(req.user!.id, id);
  }

  @Get('my')
  my(@Req() req: Request & { user?: User }) {
    return this.reviews.my(req.user!.id);
  }
}
