import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from './helpers/config';
// import { CategoriesController } from './categories/categories.controller';
// import { CategoriesService } from './categories/categories.service';
import { CategoriesModule } from './categories/categories.module';
@Module({
  imports: [
    // MongooseModule.forRoot(config.mongoURI, config.mongoConnOptions),
    MongooseModule.forRoot("mongodb://admin:admin0147@localhost:27017/nestjs_traversy_media?authSource=admin&w=1"),
    CategoriesModule
  ],
  // controllers: [CategoriesController],
  // providers: [CategoriesService]
})
export class AppModule {}
