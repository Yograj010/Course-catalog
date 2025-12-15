import {
  ArrayNotEmpty,
  IsArray,
  IsMongoId,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @MaxLength(150)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  categoryIds: string[];

  @IsArray()
  @IsMongoId({ each: true })
  subCategoryIds: string[];
}
