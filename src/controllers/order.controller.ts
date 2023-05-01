import { Controller, Post, Body, HttpCode, Get, Delete, UseGuards, Param, Query } from "@nestjs/common"
import { ApiTags, ApiResponse, ApiBody, ApiCookieAuth } from "@nestjs/swagger"

import { OrderService, OrderCreateBodyDTO, OrderDelBodyDTO, OrderGetParamDTO, OrderGetQueryDTO } from "../services/order.service"
import { AccessGuard } from "../guards/access.guard"
import { Role } from "../decorators/role.decorator"
import { RoleGuard } from "../guards/role.guard"

@ApiTags("Order")
@Controller("order")
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@ApiResponse({ status: 400, description: "Invalid request" })
	@ApiResponse({ status: 201, description: "Order successfully created" })
	@ApiCookieAuth("access")
	@ApiBody({ type: OrderCreateBodyDTO, required: true })
	@HttpCode(201)
	@Post("")
	@Role(0)
	@UseGuards(AccessGuard, RoleGuard)
	async create(@Body() body: OrderCreateBodyDTO) {
		return await this.orderService.create(body)
	}

	@ApiResponse({ status: 400, description: "Invalid request" })
	@ApiResponse({ status: 200, description: "List of orders" })
	@HttpCode(200)
	@Get("all")
	@Role(0)
	@UseGuards(RoleGuard)
	async get(@Query() query: OrderGetQueryDTO) {
		return await this.orderService.get(query)
	}

	@ApiResponse({ status: 400, description: "Invalid request" })
	@ApiResponse({ status: 200, description: "Info about order" })
	@HttpCode(200)
	@Get(":id")
	@Role(0)
	@UseGuards(RoleGuard)
	async id(@Param() param: OrderGetParamDTO) {
		return await this.orderService.id(param)
	}
	
	@ApiResponse({ status: 400, description: "Invalid request" })
	@ApiResponse({ status: 200, description: "Order successfully deleted" })
	@ApiCookieAuth("access")
	@ApiBody({ type: OrderDelBodyDTO, required: true })
	@HttpCode(200)
	@Delete("")
	@Role(0)
	@UseGuards(AccessGuard, RoleGuard)
	async del(@Body() body: OrderDelBodyDTO) {
		return await this.orderService.del(body)
	}
}