import { IsNotEmpty, IsString, IsMongoId } from "class-validator"
import { InjectModel } from "@nestjs/mongoose"
import { ApiProperty } from "@nestjs/swagger"
import { Injectable } from "@nestjs/common"

import { ExceptionService } from "../services/exception.service"
import { ISubcategoryModel } from "../models/subcategory.model"
import { ICategoryModel } from "../models/category.model"
import { IProductModel } from "../models/product.model"

export class CategoryCreateBodyDTO {
	@ApiProperty({ description: "Name", example: "Test" })
	@IsString({ message: "Name must be a string" })
	@IsNotEmpty({ message: "Name field is required" })
	name: string
}
export class CategoryDelBodyDTO {
	@ApiProperty({ description: "Id", example: "643fdf7f515f142ab61ce663" })
	@IsMongoId({ message: "Id format is invalid" })
	@IsString({ message: "Id must be a string" })
	@IsNotEmpty({ message: "Id field is required" })
	id: string
}

@Injectable()
export class CategoryService {
	constructor(private readonly exceptionService: ExceptionService, @InjectModel("Category") private readonly categoryModel: ICategoryModel, @InjectModel("Subcategory") private readonly subcategoryModel: ISubcategoryModel, @InjectModel("Product") private readonly productModel: IProductModel) {}

	async create(body: CategoryCreateBodyDTO) {
		const category = await this.categoryModel.findOne({ name: body.name })

		if(category) {
			throw this.exceptionService.conflict("Name already taken")
		} 
		else {
			await this.categoryModel.create({ name: body.name })

			return { message: "Category successfully created" }
		}
	}
	async get() {
		const categories = await this.categoryModel.find()

		if (categories.length === 0) {
			throw this.exceptionService.notFound("Categories not found")
		} 
		else {
			return categories
		}
	}
	async del(body: CategoryDelBodyDTO) {
		const category = await this.categoryModel.findById(body.id)

		if (category) {
			await category.deleteOne()
			await this.subcategoryModel.deleteMany({ category: category.id })
			await this.productModel.deleteMany({ category: category.id })

			return { message: "Category successfully deleted" }
		} 
		else {
			throw this.exceptionService.notFound("Category not found")
		}
	}
}