import { Body, Controller, Get, Param, Patch, Post, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { QueryCourseDto } from './dto/query-course.dto';

@Controller('courses')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) { }

    //Controller function to create a course
    @Post()
    async create(@Body() dto: CreateCourseDto) {
        const course = await this.coursesService.create(dto);
        return { success: true, data: course };
    }

    //Controller function to getall courses
    @Get()
    async findAll(@Query() query: QueryCourseDto) {
        return this.coursesService.findAll(query);
    }

    //Controller function to get a course by id
    @Get(':id')
    async findOne(@Param('id') id: string) {
        const course = await this.coursesService.findOne(id);
        return { success: true, data: course };
    }

    //Controller function to update a course by id
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateCourseDto,
    ) {
        const course = await this.coursesService.update(id, dto);
        return { success: true, data: course };
    }

    //Controller function to soft-delete a course by id
    @Delete(':id')
    // @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string) {
        await this.coursesService.softDelete(id);
        return { success: true, message: "Course deleted successfully" }
    }
}
