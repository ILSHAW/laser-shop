import { IsNotEmpty, IsString, IsMongoId } from "class-validator"
import { InjectModel } from "@nestjs/mongoose"
import { ApiProperty } from "@nestjs/swagger"
import { Injectable } from "@nestjs/common"

import { ExceptionService } from "../services/exception.service"
import { ISubcategoryModel } from "../models/subcategory.model"
import { ICategoryModel } from "../models/category.model"
import { IProductModel } from "../models/product.model"

export class CategoryCreateBodyDTO {
	@ApiProperty({ description: "Category name", example: "Test", type: String, required: true })
	@IsString({ message: "Category name must be a string" })
	@IsNotEmpty({ message: "Category name field is required" })
	name: string
}
export class CategoryGetParamDTO {
	@ApiProperty({ description: "Category id", example: "643fdf7f515f142ab61ce663", type: String, required: true })
	@IsMongoId({ message: "Category id format is invalid" })
	@IsString({ message: "Category id must be a string" })
	@IsNotEmpty({ message: "Category id field is required" })
	id: string
}
export class CategoryDelBodyDTO {
	@ApiProperty({ description: "Category id", example: "643fdf7f515f142ab61ce663", type: String, required: true })
	@IsMongoId({ message: "Category id format is invalid" })
	@IsString({ message: "Category id must be a string" })
	@IsNotEmpty({ message: "Category id field is required" })
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
	async id(param: CategoryGetParamDTO) {
		const category = await this.categoryModel.findById(param.id)

		if (category) {
			return category
		} 
		else {
			throw this.exceptionService.notFound("Category not found")
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