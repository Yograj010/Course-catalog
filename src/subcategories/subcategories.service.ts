import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubCategory, SubCategoryDocument } from './schemas/subcategory.schema';
import { CreateSubCategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubCategoryDto } from './dto/update-subcategory.dto';
import { QuerySubCategoryDto } from './dto/query-subcategory.dto';
import { Category, CategoryDocument } from '../categories/schemas/category.schema';

@Injectable()
export class SubCategoriesService {
    constructor(
        @InjectModel(SubCategory.name)
        private readonly subCategoryModel: Model<SubCategoryDocument>,
        @InjectModel(Category.name)
        private readonly categoryModel: Model<CategoryDocument>,
    ) { }

    //Service to create a subCategory 
    async create(dto: CreateSubCategoryDto): Promise<SubCategory> {
        const category = await this.categoryModel
            .findOne({ _id: dto.categoryId, isDeleted: false })
            .exec();
        if (!category) {
            throw new BadRequestException('Invalid categoryId');
        }

        const created = new this.subCategoryModel({
            name: dto.name,
            description: dto.description,
            category: dto.categoryId,
        });

        return created.save();
    }

    //Service to findAll subCategory using filter
    async findAll(query: QuerySubCategoryDto) {
        const {
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            search,
            categoryId,
        } = query;

        const filter: any = { isDeleted: false };

        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }

        if (categoryId) {
            filter.category = categoryId;
        }

        const skip = (page - 1) * limit;
        const sort: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

        const [items, total] = await Promise.all([
            this.subCategoryModel
                .find(filter)
                .populate('category')
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .exec(),
            this.subCategoryModel.countDocuments(filter),
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

    //Service to find a subCategory by id
    async findOne(id: string): Promise<SubCategory> {
        const subCategory = await this.subCategoryModel
            .findOne({ _id: id, isDeleted: false })
            .populate('category')
            .exec();
        if (!subCategory) {
            throw new NotFoundException('SubCategory not found');
        }
        return subCategory;
    }

    //Service to update a subCategory by id
    async update(id: string, dto: UpdateSubCategoryDto): Promise<SubCategory> {
        if (dto.categoryId) {
            const category = await this.categoryModel
                .findOne({ _id: dto.categoryId, isDeleted: false })
                .exec();
            if (!category) {
                throw new BadRequestException('Invalid categoryId');
            }
        }

        const updatePayload: any = { ...dto };
        if (dto.categoryId) {
            updatePayload.category = dto.categoryId;
            delete updatePayload.categoryId;
        }

        const updated = await this.subCategoryModel
            .findOneAndUpdate({ _id: id, isDeleted: false }, updatePayload, {
                new: true,
            })
            .exec();
        if (!updated) {
            throw new NotFoundException('SubCategory not found');
        }
        return updated;
    }

    //Service to softDelete a subCategory by id
    async softDelete(id: string): Promise<void> {
        const res = await this.subCategoryModel
            .findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true })
            .exec();
        if (!res) {
            throw new NotFoundException('SubCategory not found');
        }
    }
    /**/
}
