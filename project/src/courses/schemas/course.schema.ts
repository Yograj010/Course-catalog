import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from '../../categories/schemas/category.schema';
import { SubCategory } from '../../subcategories/schemas/subcategory.schema';

export type CourseDocument = Course & Document;

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: Category.name }],
    default: [],
  })
  categories: Types.ObjectId[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: SubCategory.name }],
    default: [],
  })
  subCategories: Types.ObjectId[];

  @Prop({ default: false })
  isDeleted: boolean;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
