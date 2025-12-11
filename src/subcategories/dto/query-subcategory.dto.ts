import { PaginationQueryDto } from '../../common/pagination-query.dto';
import { IsMongoId, IsOptional } from 'class-validator';

export class QuerySubCategoryDto extends PaginationQueryDto {
  @IsOptional()
  @IsMongoId()
  categoryId?: string;
}
