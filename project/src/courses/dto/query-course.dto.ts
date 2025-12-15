import { PaginationQueryDto } from '../../common/dtos/pagination-query.dto';
import { IsMongoId, IsOptional } from 'class-validator';

export class QueryCourseDto extends PaginationQueryDto {
  @IsOptional()
  @IsMongoId()
  categoryId?: string;

  @IsOptional()
  @IsMongoId()
  subCategoryId?: string;
}
