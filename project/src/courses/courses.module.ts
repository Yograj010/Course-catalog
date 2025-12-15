import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Course, CourseSchema } from './schemas/course.schema';
import { Category, CategorySchema } from '../categories/schemas/category.schema';
import {
  SubCategory,
  SubCategorySchema,
} from '../subcategories/schemas/subcategory.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema },
      { name: Category.name, schema: CategorySchema },
      { name: SubCategory.name, schema: SubCategorySchema },
    ]),
  ],
  controllers: [CoursesController],
  providers: [CoursesService]
})
export class CoursesModule {}
