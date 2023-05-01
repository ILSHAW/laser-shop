import { IsNotEmpty, IsString, IsMongoId, IsArray, ArrayMinSize, ArrayMaxSize, IsNumberString, IsBooleanString, IsOptional } from "class-validator"
import { InjectModel } from "@nestjs/mongoose"
import { ApiProperty } from "@nestjs/swagger"
import { Injectable } from "@nestjs/common"

import { ExceptionService } from "../services/exception.service"
import { IOrderModel } from "../models/order.model"

export class OrderCreateBodyDTO {
	@ApiProperty({ description: "Customer", example: "643fdf7f515f142ab61ce663", type: String, required: true })
	@IsMongoId({ message: "Customer id format is invalid" })
	@IsString({ message: "Customer id must be a string" })
	@IsNotEmpty({ message: "Customer id field is required" })
    customer: string
	@ApiProperty({ description: "Products", example: ["643fdf7f515f142ab61ce663"], type: [String], required: true })
	@IsMongoId({ message: "Product id format is invalid", each: true })
	@ArrayMaxSize(10, { message: "Products field must contain less than 10 items" })
	@ArrayMinSize(1, { message: "Products field must contain at least 1 item" })
	@IsArray({ message: "Products field must be an array" })
	@IsNotEmpty({ message: "Products field is required" })
    products: Array<string>
}
export class OrderGetQueryDTO {
	@ApiProperty({ description: "Limit", example: "10", type: Number, required: true })
	@IsNumberString({ no_symbols: true }, { message: "Limit must be a number" })
	@IsNotEmpty({ message: "Limit field is required" })
	limit: string
	@ApiProperty({ description: "Page", example: "0", type: Number, required: true })
	@IsNumberString({ no_symbols: true }, { message: "Page must be a number" })
	@IsNotEmpty({ message: "Page field is required" })
	page: string
	@ApiProperty({ description: "Paid", type: Boolean, required: false })
	@IsBooleanString({ message: "Paid filed must be a boolean" })
	@IsNotEmpty({ message: "Paid field is required" })
	@IsOptional()
	paid: string
}
export class OrderGetParamDTO {
	@ApiProperty({ description: "Id", example: "643fdf7f515f142ab61ce663", type: String, required: true })
	@IsMongoId({ message: "Id format is invalid" })
	@IsString({ message: "Id must be a string" })
	@IsNotEmpty({ message: "Id field is required" })
	id: string
}
export class OrderDelBodyDTO {
	@ApiProperty({ description: "Id", example: "643fdf7f515f142ab61ce663", type: String, required: true })
	@IsMongoId({ message: "Id format is invalid" })
	@IsString({ message: "Id must be a string" })
	@IsNotEmpty({ message: "Id field is required" })
	id: string
}

@Injectable()
export class OrderService {
	constructor(private readonly exceptionService: ExceptionService, @InjectModel("Order") private readonly orderModel: IOrderModel) {}

	async create(body: OrderCreateBodyDTO) {
		await this.orderModel.create({
			customer: body.customer,
			products: body.products
		})

		return { message: "Order successfully created" }
	}
	async get(query: OrderGetQueryDTO) {
		let orders = await this.orderModel.find().limit(Number(query.limit)).skip(Number(query.limit)*Number(query.page))

		if(query.paid) {
			orders = orders.filter((order) => order.paid === (query.paid === "true" ? true : false))
		}

		if (orders.length === 0) {
			throw this.exceptionService.notFound("Orders not found")
		} 
		else {
			return orders
		}
	}
	async id(param: OrderGetParamDTO) {
		const order = await this.orderModel.findById(param.id)

		if (order) {
			return order
		} 
		else {
			throw this.exceptionService.notFound("Order not found")
		}
	}
	async del(body: OrderDelBodyDTO) {
		const order = await this.orderModel.findById(body.id)

		if (order) {
			await order.deleteOne()

			return { message: "Order successfully deleted" }
		} 
		else {
			throw this.exceptionService.notFound("Order not found")
		}
	}
}