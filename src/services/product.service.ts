import { IsNotEmpty, IsString, IsMongoId, IsNumberString, IsOptional } from "class-validator"
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
    @ApiProperty({ description: "Subcategory id", example: "643fdf7f515f142ab61ce663", type: String, required: true })
	@IsMongoId({ message: "Subcategory id format is invalid" })
	@IsString({ message: "Subcategory id must be a string" })
	@IsNotEmpty({ message: "Subcategory id field is required" })
	subcategory: string
	@ApiProperty({ description: "Product name", example: "Test", type: String, required: true })
	@IsString({ message: "Product name must be a string" })
	@IsNotEmpty({ message: "Product name field is required" })
	name: string
	@ApiProperty({ description: "Product price", example: "1000", type: String, required: true })
	@IsNumberString({ no_symbols: true }, { message: "Product price must be a string number" })
	@IsNotEmpty({ message: "Product price field is required" })
	price: string
	@ApiProperty({ description: "Product color", example: "White", type: String, required: true })
	@IsString({ message: "Product color must be a string" })
	@IsNotEmpty({ message: "Product color field is required" })
	color: string
	@ApiProperty({ type: "array", items: { type: "string", format: "binary" }, description: "Product images", required: true })
	images: any
}
export class ProductGetQueryDTO {
	@ApiProperty({ description: "Category id", example: "643fdf7f515f142ab61ce663", type: String, required: false })
	@IsMongoId({ message: "Category id format is invalid" })
	@IsString({ message: "Category id must be a string" })
	@IsOptional()
	category: string
	@ApiProperty({ description: "Subcategory id", example: "643fdf7f515f142ab61ce663", type: String, required: false })
	@IsMongoId({ message: "Subcategory id format is invalid" })
	@IsString({ message: "Subcategory id must be a string" })
	@IsOptional()
	subcategory: string
	@ApiProperty({ description: "Sort property", example: "name", type: String, required: false })
	@IsString({ message: "Sort property must be a string" })
	@IsOptional()
	sort: string
	@ApiProperty({ description: "Sort direction", example: "0", type: String, required: false })
	@IsString({ message: "Sort direction must be a string" })
	@IsOptional()
	direction: string
}
export class ProductGetParamDTO {
	@ApiProperty({ description: "Product id", example: "643fdf7f515f142ab61ce663", type: String, required: true })
	@IsMongoId({ message: "Product id format is invalid" })
	@IsString({ message: "Product id must be a string" })
	@IsNotEmpty({ message: "Product id field is required" })
	id: string
}
export class ProductDelBodyDTO {
	@ApiProperty({ description: "Product id", example: "643fdf7f515f142ab61ce663", type: String, required: true })
	@IsMongoId({ message: "Product id format is invalid" })
	@IsString({ message: "Product id must be a string" })
	@IsNotEmpty({ message: "Product id field is required" })
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
					name: body.name,
					price: Number(body.price),
					color: body.color
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

		if(query.category && !category) throw this.exceptionService.notFound("Category not found")
		if(query.subcategory && !subcategory) throw this.exceptionService.notFound("Subcategory not found")

		let products = await this.productModel.find().then((result) => {
			if(category) {
				result = result.filter((product) => product.category == category.id)
			}
			if(subcategory) {
				result = result.filter((product) => product.subcategory == subcategory.id)
			}
			if(query.sort && query.direction) {
				if(query.sort === "name" && query.direction === "0") {
					result = result.sort((a, b) => a.name > b.name ? 1 : (a.name === b.name ? 0 : -1))
				}
				if(query.sort === "name" && query.direction === "1") {
					result = result.sort((a, b) => a.name > b.name ? -1 : (a.name === b.name ? 0 : 1))
				}
				if(query.sort === "price" && query.direction === "0") {
					result = result.sort((a, b) => a.price > b.price ? 1 : (a.price === b.price ? 0 : -1))
				}
				if(query.sort === "price" && query.direction === "1") {
					result = result.sort((a, b) => a.price > b.price ? -1 : (a.price === b.price ? 0 : 1))
				}
				if(query.sort === "color" && query.direction === "0") {
					result = result.sort((a, b) => a.color > b.color ? 1 : (a.color === b.color ? 0 : -1))
				}
				if(query.sort === "color" && query.direction === "1") {
					result = result.sort((a, b) => a.color > b.color ? -1 : (a.color === b.color ? 0 : 1))
				}
			}

			return result
		})

		return products
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