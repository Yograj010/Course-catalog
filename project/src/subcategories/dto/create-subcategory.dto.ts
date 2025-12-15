import { IsMongoId, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSubCategoryDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsMongoId()
  categoryId: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
