import { IsNotEmpty, IsString, IsMongoId, IsNumberString } from "class-validator"
import { InjectModel } from "@nestjs/mongoose"
import { ApiProperty } from "@nestjs/swagger"
import { Injectable } from "@nestjs/common"
import * as sharp from "sharp"
import * as path from "path"
import * as fs from "fs"

import { ExceptionService } from "../services/exception.service"
import { ISubcategoryModel } from "../models/subcategory.model"
import { ICategoryModel } from "../models/category.model"
import { IProductModel } from "../models/product.model"

export class ProductCreateBodyDTO {
    @ApiProperty({ description: "Subcategory", example: "643fdf7f515f142ab61ce663", type: String, required: true })
	@IsMongoId({ message: "Subcategory id format is invalid" })
	@IsString({ message: "Subcategory id must be a string" })
	@IsNotEmpty({ message: "Subcategory id field is required" })
	subcategory: string
	@ApiProperty({ description: "Name", example: "Test", type: String, required: true })
	@IsString({ message: "Name must be a string" })
	@IsNotEmpty({ message: "Name field is required" })
	name: string
	@ApiProperty({ type: "array", items: { type: "string", format: "binary" }, description: "Images", required: true })
	images: any
}
export class ProductGetQueryDTO {
	@ApiProperty({ description: "Category", example: "643fdf7f515f142ab61ce663", type: String, required: true })
	@IsMongoId({ message: "Category id format is invalid" })
	@IsString({ message: "Category id must be a string" })
	@IsNotEmpty({ message: "Category id field is required" })
	category: string
	@ApiProperty({ description: "Subcategory", example: "643fdf7f515f142ab61ce663", type: String, required: true })
	@IsMongoId({ message: "Subcategory id format is invalid" })
	@IsString({ message: "Subcategory id must be a string" })
	@IsNotEmpty({ message: "Subcategory id field is required" })
	subcategory: string
	@ApiProperty({ description: "Limit", example: "10", type: Number, required: true })
	@IsNumberString({ no_symbols: true }, { message: "Limit must be a number" })
	@IsNotEmpty({ message: "Limit field is required" })
	limit: string
	@ApiProperty({ description: "Page", example: "0", type: Number, required: true })
	@IsNumberString({ no_symbols: true }, { message: "Page must be a number" })
	@IsNotEmpty({ message: "Page field is required" })
	page: string
}
export class ProductGetParamDTO {
	@ApiProperty({ description: "Id", example: "643fdf7f515f142ab61ce663", type: String, required: true })
	@IsMongoId({ message: "Id format is invalid" })
	@IsString({ message: "Id must be a string" })
	@IsNotEmpty({ message: "Id field is required" })
	id: string
}
export class ProductDelBodyDTO {
	@ApiProperty({ description: "Id", example: "643fdf7f515f142ab61ce663", type: String, required: true })
	@IsMongoId({ message: "Id format is invalid" })
	@IsString({ message: "Id must be a string" })
	@IsNotEmpty({ message: "Id field is required" })
	id: string
}

@Injectable()
export class ProductService {
	constructor(private readonly exceptionService: ExceptionService, @InjectModel("Category") private readonly categoryModel: ICategoryModel, @InjectModel("Subcategory") private readonly subcategoryModel: ISubcategoryModel, @InjectModel("Product") private readonly productModel: IProductModel) {}

	async create(body: ProductCreateBodyDTO, files: Array<Express.Multer.File>) {
		const cover = files[0]
		const images = files.slice(1)

		const subcategory = await this.subcategoryModel.findById(body.subcategory)

		if(subcategory) {
			const product = await this.subcategoryModel.findOne({ subcategory: subcategory.id, name: body.name })

			if(product) {
				throw this.exceptionService.conflict("Name already taken")
			}
			else {
				const product = await this.productModel.create({ 
					category: subcategory.category, 
					subcategory: subcategory.id, 
					name: body.name
				})

				await sharp(cover.buffer).jpeg().toFile(path.resolve(`public/images/product_${product.id}_cover.jpg`))

				await product.updateOne({ cover: `product_${product.id}_cover.jpg` })

				images.forEach(async (image, i) => {
					await sharp(image.buffer).jpeg().toFile(path.resolve(`public/images/product_${product.id}_${i}.jpg`))

					await product.updateOne({ $push: { images: `product_${product.id}_${i}.jpg` } })
				})

				return { message: "Product successfully created" }
			}
		}
		else {
			throw this.exceptionService.notFound("Subcategory not found")
		}
	}
	async get(query: ProductGetQueryDTO) {
		const category = await this.categoryModel.findById(query.category)
		const subcategory = await this.subcategoryModel.findById(query.subcategory)

		if(category) {
			if (subcategory) {
				const products = await this.productModel.find({ category: category.id, subcategory: subcategory.id }).limit(Number(query.limit)).skip(Number(query.limit)*Number(query.page))
	
				if (products.length === 0) {
					throw this.exceptionService.notFound("Products not found")
				} 
				else {
					return products
				}
			} 
			else {
				throw this.exceptionService.notFound("Subcategory not found")
			}
		}
		else {
			throw this.exceptionService.notFound("Category not found")
		}
	}
	async id(param: ProductGetParamDTO) {
		const product = await this.productModel.findById(param.id)
	
		if (product) {
			return product
		} 
		else {
			throw this.exceptionService.notFound("Product not found")
		}
	}
	async del(body: ProductDelBodyDTO) {
		const product = await this.productModel.findById(body.id)

		if (product) {
			await product.deleteOne()

			fs.rmSync(path.resolve(`public/images/${product.cover}`))

			product.images.forEach((image) => {
				fs.rmSync(path.resolve(`public/images/${image}`))
			})

			return { message: "Product successfully deleted" }
		} 
		else {
			throw this.exceptionService.notFound("Product not found")
		}
	}
}