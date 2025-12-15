import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Course, CourseDocument } from './schemas/course.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { QueryCourseDto } from './dto/query-course.dto';
import { Category, CategoryDocument } from '../categories/schemas/category.schema';
import { SubCategory, SubCategoryDocument } from '../subcategories/schemas/subcategory.schema';

@Injectable()
export class CoursesService {
    constructor(
        @InjectModel(Course.name)
        private readonly courseModel: Model<CourseDocument>,
        @InjectModel(Category.name)
        private readonly categoryModel: Model<CategoryDocument>,
        @InjectModel(SubCategory.name)
        private readonly subCategoryModel: Model<SubCategoryDocument>,
        @InjectConnection()
        private readonly connection: Connection,
    ) { }

    //function to create a course
    async create(dto: CreateCourseDto): Promise<Course> {
        const session = await this.connection.startSession();
        let createdCourse: Course | null = null;

        try {
            await session.withTransaction(async () => {
                const { categoryIds, subCategoryIds } = dto;

                const categories = await this.categoryModel
                    .find({ _id: { $in: categoryIds }, isDeleted: false })
                    .session(session);
                if (categories.length !== categoryIds.length) {
                    throw new BadRequestException('One or more categoryIds are invalid');
                }

                const subCategories = await this.subCategoryModel
                    .find({ _id: { $in: subCategoryIds }, isDeleted: false })
                    .session(session);
                if (subCategories.length !== subCategoryIds.length) {
                    throw new BadRequestException(
                        'One or more subCategoryIds are invalid',
                    );
                }

                const categoryIdsSet = new Set(
                    categories.map((c) => c._id.toString()),
                );

                const invalidSub = subCategories.find(
                    (sc) => !categoryIdsSet.has(sc.category.toString()),
                );
                if (invalidSub) {
                    throw new BadRequestException(
                        'All selected subCategories must belong to the selected categories',
                    );
                }

                const [course] = await this.courseModel.create(
                    [
                        {
                            title: dto.title,
                            description: dto.description,
                            categories: categoryIds,
                            subCategories: subCategoryIds,
                        },
                    ],
                    { session },
                );
                createdCourse = course;
            });

            if (!createdCourse) {
                throw new BadRequestException('Failed to create course');
            }

            return createdCourse;
        } finally {
            await session.endSession();
        }
    }

    //function to find all courses
    async findAll(query: QueryCourseDto) {
        const {
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            search,
            categoryId,
            subCategoryId,
        } = query;

        const filter: any = { isDeleted: false };

        if (search) {
            filter.title = { $regex: search, $options: 'i' };
        }
        if (categoryId) {
            filter.categories = categoryId;
        }
        if (subCategoryId) {
            filter.subCategories = subCategoryId;
        }

        const skip = (page - 1) * limit;
        const sort: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

        const [items, total] = await Promise.all([
            this.courseModel
                .find(filter)
                .populate('categories')
                .populate('subCategories')
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .exec(),
            this.courseModel.countDocuments(filter),
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

    //function to find a course
    async findOne(id: string): Promise<Course> {
        const course = await this.courseModel
            .findOne({ _id: id, isDeleted: false })
            .populate('categories')
            .populate('subCategories')
            .exec();
        if (!course) {
            throw new NotFoundException('Course not found');
        }
        return course;
    }

    //function to update a course by id
    async update(id: string, dto: UpdateCourseDto): Promise<Course> {
        const course = await this.courseModel
            .findOne({ _id: id, isDeleted: false })
            .exec();
        if (!course) {
            throw new NotFoundException('Course not found');
        }

        if (dto.categoryIds || dto.subCategoryIds) {
            const categoryIds = dto.categoryIds ?? course.categories.map((c) => c.toString());
            const subCategoryIds =
                dto.subCategoryIds ?? course.subCategories.map((s) => s.toString());

            const categories = await this.categoryModel.find({
                _id: { $in: categoryIds },
                isDeleted: false,
            });
            if (categories.length !== categoryIds.length) {
                throw new BadRequestException('One or more categoryIds are invalid');
            }

            const subCategories = await this.subCategoryModel.find({
                _id: { $in: subCategoryIds },
                isDeleted: false,
            });
            if (subCategories.length !== subCategoryIds.length) {
                throw new BadRequestException(
                    'One or more subCategoryIds are invalid',
                );
            }

            const categoryIdsSet = new Set(
                categories.map((c) => c._id.toString()),
            );

            const invalidSub = subCategories.find(
                (sc) => !categoryIdsSet.has(sc.category.toString()),
            );
            if (invalidSub) {
                throw new BadRequestException(
                    'All selected subCategories must belong to the selected categories',
                );
            }

            course.categories = categoryIds as any;
            course.subCategories = subCategoryIds as any;
        }

        if (dto.title !== undefined) {
            course.title = dto.title;
        }
        if (dto.description !== undefined) {
            course.description = dto.description;
        }

        return course.save();
    }

    //function to soft delete a course by id 
    async softDelete(id: string): Promise<void> {
        const res = await this.courseModel
            .findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true })
            .exec();
        if (!res) {
            throw new NotFoundException('Course not found');
        }
    }
}
