import { Body, Controller, Get, Param, Patch, Post, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { SubCategoriesService } from './subcategories.service';
import { CreateSubCategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubCategoryDto } from './dto/update-subcategory.dto';
import { QuerySubCategoryDto } from './dto/query-subcategory.dto';

@Controller('subcategories')
export class SubcategoriesController {
    constructor(private readonly subCategoriesService: SubCategoriesService) { }
    
    //function to create a subCategory
    @Post()
    async create(@Body() dto: CreateSubCategoryDto) {
        const subCategory = await this.subCategoriesService.create(dto);
        return { success: true, data: subCategory };
    }

    //function to find all subCategory
    @Get()
    async findAll(@Query() query: QuerySubCategoryDto) {
        return this.subCategoriesService.findAll(query);
    }

    //function to get a subCategory by id
    @Get(':id')
    async findOne(@Param('id') id: string) {
        const subCategory = await this.subCategoriesService.findOne(id);
        return { success: true, data: subCategory };
    }

    //function to update a subCategory by id
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateSubCategoryDto,
    ) {
        const subCategory = await this.subCategoriesService.update(id, dto);
        return { success: true, data: subCategory };
    }

    //function to delete a subCategory by id
    @Delete(':id')
    // @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string) {
        await this.subCategoriesService.softDelete(id);
        return { success: true, message: "subCategory deleted successfully"}
    }
}
