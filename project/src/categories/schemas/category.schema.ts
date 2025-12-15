import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);



// import * as mongoose from 'mongoose';
// export const CategorySchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//       unique: true
//     },
//     description: {
//       type: String
//     },
//     isDeleted: {
//       type: Boolean,
//       default: false
//     }
//   },
//   {
//     timestamps: true,
//     versionKey: false
//   }
// );

