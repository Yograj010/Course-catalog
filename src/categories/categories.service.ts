import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';

@Injectable()
export class CategoriesService {
      constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    const created = new this.categoryModel(dto);
    return created.save();
  }

  async findAll(query: QueryCategoryDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
    } = query;

    const filter: any = { isDeleted: false };

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    const sort: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [items, total] = await Promise.all([
      this.categoryModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      this.categoryModel.countDocuments(filter),
    ]);

    return {
      success: true,
      data: items,
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel
      .findOne({ _id: id, isDeleted: false })
      .exec();
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const updated = await this.categoryModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, dto, {
        new: true,
      })
      .exec();
    if (!updated) {
      throw new NotFoundException('Category not found');
    }
    return updated;
  }

  async softDelete(id: string): Promise<void> {
    const res = await this.categoryModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true })
      .exec();
    if (!res) {
      throw new NotFoundException('Category not found');
    }
  }

  async getWithSubCategoryCount() {
    // MongoDB aggregation: Each Category with count of SubCategories
    return this.categoryModel.aggregate([
      { $match: { isDeleted: false } },
      {
        $lookup: {
          from: 'subcategories',
          localField: '_id',
          foreignField: 'category',
          as: 'subCategories',
        },
      },
      {
        $addFields: {
          subCategoryCount: { $size: '$subCategories' },
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          subCategoryCount: 1,
        },
      },
    ]);
  }
}
