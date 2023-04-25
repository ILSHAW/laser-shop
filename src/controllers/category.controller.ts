import { Controller, Post, Body, HttpCode, Get, Delete, UseGuards } from "@nestjs/common"
import { ApiTags, ApiResponse, ApiBody, ApiCookieAuth } from "@nestjs/swagger"

import { CategoryService, CategoryCreateBodyDTO, CategoryDelBodyDTO } from "../services/category.service"
import { AccessGuard } from "../guards/access.guard"
import { Role } from "../decorators/role.decorator"
import { RoleGuard } from "../guards/role.guard"

@ApiTags("Category")
@Controller("category")
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@ApiResponse({ status: 400, description: "Invalid request" })
	@ApiResponse({ status: 201, description: "Category successfully created" })
	@ApiCookieAuth("access")
	@ApiBody({ type: CategoryCreateBodyDTO, required: true })
	@HttpCode(201)
	@Post("")
	@Role(0)
	@UseGuards(AccessGuard, RoleGuard)
	async create(@Body() body: CategoryCreateBodyDTO) {
		return await this.categoryService.create(body)
	}

	@ApiResponse({ status: 400, description: "Invalid request" })
	@ApiResponse({ status: 200, description: "List of categories" })
	@HttpCode(200)
	@Get("")
	@Role(0)
	@UseGuards(RoleGuard)
	async get() {
		return await this.categoryService.get()
	}
	
	@ApiResponse({ status: 400, description: "Invalid request" })
	@ApiResponse({ status: 200, description: "Category successfully deleted" })
	@ApiCookieAuth("access")
	@ApiBody({ type: CategoryDelBodyDTO, required: true })
	@HttpCode(200)
	@Delete("")
	@Role(0)
	@UseGuards(AccessGuard, RoleGuard)
	async del(@Body() body: CategoryDelBodyDTO) {
		return await this.categoryService.del(body)
	}
}