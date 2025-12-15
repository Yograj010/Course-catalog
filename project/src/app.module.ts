import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from './helpers/config';
import { CategoriesModule } from './categories/categories.module';
import { SubCategoriesModule } from './subcategories/subcategories.module';
import { CoursesModule } from './courses/courses.module';
@Module({
  imports: [
    MongooseModule.forRoot(config.mongoURI, config.mongoConnOptions),
    CategoriesModule,
    SubCategoriesModule,
    CoursesModule,
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
