import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubCategoriesService } from './subcategories.service';
import { SubcategoriesController } from './subcategories.controller';
import { SubCategory, SubCategorySchema } from './schemas/subcategory.schema';
import { Category, CategorySchema } from '../categories/schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubCategory.name, schema: SubCategorySchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  providers: [SubCategoriesService],
  controllers: [SubcategoriesController],
  exports: [MongooseModule],
})
export class SubCategoriesModule {}
