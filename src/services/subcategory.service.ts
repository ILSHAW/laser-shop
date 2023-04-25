import { IsNotEmpty, IsString, IsMongoId } from "class-validator"
import { InjectModel } from "@nestjs/mongoose"
import { ApiProperty } from "@nestjs/swagger"
import { Injectable } from "@nestjs/common"

import { ExceptionService } from "../services/exception.service"
import { ISubcategoryModel } from "../models/subcategory.model"
import { ICategoryModel } from "../models/category.model"
import { IProductModel } from "../models/product.model"

export class SubcategoryCreateBodyDTO {
    @ApiProperty({ description: "Category", example: "643fdf7f515f142ab61ce663" })
	@IsMongoId({ message: "Category id format is invalid" })
	@IsString({ message: "Category id must be a string" })
	@IsNotEmpty({ message: "Category id field is required" })
	category: string
	@ApiProperty({ description: "Name", example: "Test" })
	@IsString({ message: "Name must be a string" })
	@IsNotEmpty({ message: "Name field is required" })
	name: string
}
export class SubcategoryGetQueryDTO {
	@ApiProperty({ description: "Category", example: "643fdf7f515f142ab61ce663" })
	@IsMongoId({ message: "Category id format is invalid" })
	@IsString({ message: "Category id must be a string" })
	@IsNotEmpty({ message: "Category id field is required" })
	category: string
}
export class SubcategoryDelBodyDTO {
	@ApiProperty({ description: "Id", example: "643fdf7f515f142ab61ce663" })
	@IsMongoId({ message: "Id format is invalid" })
	@IsString({ message: "Id must be a string" })
	@IsNotEmpty({ message: "Id field is required" })
	id: string
}

@Injectable()
export class SubcategoryService {
	constructor(private readonly exceptionService: ExceptionService, @InjectModel("Category") private readonly categoryModel: ICategoryModel, @InjectModel("Subcategory") private readonly subcategoryModel: ISubcategoryModel, @InjectModel("Product") private readonly productModel: IProductModel) {}

	async create(body: SubcategoryCreateBodyDTO) {
		const category = await this.categoryModel.findById(body.category)

		if(category) {
			const subcategory = await this.subcategoryModel.findOne({ category: category.id, name: body.name })

			if(subcategory) {
				throw this.exceptionService.conflict("Name already taken")
			}
			else {
				await this.subcategoryModel.create({ category: category.id, name: body.name })

				return { message: "Subcategory successfully created" }
			}
		} 
		else {
			throw this.exceptionService.notFound("Category not found")
		}
	}
	async get(query: SubcategoryGetQueryDTO) {
		const category = await this.categoryModel.findById(query.category)

		if (category) {
			const subcategories = await this.subcategoryModel.find({ category: category.id })

			if (subcategories.length === 0) {
				throw this.exceptionService.notFound("Subcategories not found")
			} 
			else {
				return subcategories
			}
		} 
		else {
			throw this.exceptionService.notFound("Category not found")
		}
	}
	async del(body: SubcategoryDelBodyDTO) {
		const subcategory = await this.subcategoryModel.findById(body.id)

		if (subcategory) {
			await subcategory.deleteOne()
			await this.productModel.deleteMany({ subcategory: subcategory.id })

			return { message: "Subcategory successfully deleted" }
		} 
		else {
			throw this.exceptionService.notFound("Subcategory not found")
		}
	}
}