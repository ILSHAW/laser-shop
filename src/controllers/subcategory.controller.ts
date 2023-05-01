import { Controller, Post, Body, HttpCode, Get, Delete, UseGuards, Query } from "@nestjs/common"
import { ApiTags, ApiResponse, ApiBody, ApiCookieAuth, ApiQuery } from "@nestjs/swagger"

import { SubcategoryService, SubcategoryCreateBodyDTO, SubcategoryGetQueryDTO, SubcategoryDelBodyDTO } from "../services/subcategory.service"
import { AccessGuard } from "../guards/access.guard"
import { Role } from "../decorators/role.decorator"
import { RoleGuard } from "../guards/role.guard"

@ApiTags("Subcategory")
@Controller("subcategory")
export class SubcategoryController {
	constructor(private readonly subcategoryService: SubcategoryService) {}

	@ApiResponse({ status: 400, description: "Invalid request" })
	@ApiResponse({ status: 201, description: "Subcategory successfully created" })
	@ApiCookieAuth("access")
	@ApiBody({ type: SubcategoryCreateBodyDTO, required: true })
	@HttpCode(201)
	@Post("")
	@Role(0)
	@UseGuards(AccessGuard, RoleGuard)
	async create(@Body() body: SubcategoryCreateBodyDTO) {
		return await this.subcategoryService.create(body)
	}

	@ApiResponse({ status: 400, description: "Invalid request" })
	@ApiResponse({ status: 200, description: "List of subcategories" })
	@HttpCode(200)
	@Get("")
	@Role(0)
	@UseGuards(RoleGuard)
	async get(@Query() query: SubcategoryGetQueryDTO) {
		return await this.subcategoryService.get(query)
	}
	
	@ApiResponse({ status: 400, description: "Invalid request" })
	@ApiResponse({ status: 200, description: "Subcategory successfully deleted" })
	@ApiCookieAuth("access")
	@ApiBody({ type: SubcategoryDelBodyDTO, required: true })
	@HttpCode(200)
	@Delete("")
	@Role(0)
	@UseGuards(AccessGuard, RoleGuard)
	async del(@Body() body: SubcategoryDelBodyDTO) {
		return await this.subcategoryService.del(body)
	}
}