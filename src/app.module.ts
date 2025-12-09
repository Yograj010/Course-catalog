import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from './helpers/config';
import { CategoriesController } from './categories/categories.controller';
@Module({
  imports: [
    MongooseModule.forRoot(config.mongoURI, config.mongoConnOptions)
  ],
  controllers: [CategoriesController],
  providers: []
})
export class AppModule {}
