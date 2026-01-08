import { IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator';

export class SetProductCategoriesDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  categoryIds: number[];
}
