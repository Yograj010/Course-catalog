import { IsOptional, IsString, MaxLength } from "class-validator";

export class CreateCategoryDto{
    @IsString()
    @MaxLength(500)
    name: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    description: string;
}