import { Controller, Post, Body, HttpCode, Get, Delete, UseGuards, Query, UseInterceptors, UploadedFiles, Param } from "@nestjs/common"
import { ApiTags, ApiResponse, ApiBody, ApiCookieAuth, ApiConsumes } from "@nestjs/swagger"
import { FilesInterceptor } from "@nestjs/platform-express"

import { ProductService, ProductCreateBodyDTO, ProductGetQueryDTO, ProductGetParamDTO, ProductDelBodyDTO } from "../services/product.service"
import { AccessGuard } from "../guards/access.guard"
import { Role } from "../decorators/role.decorator"
import { RoleGuard } from "../guards/role.guard"

@ApiTags("Product")
@Controller("product")
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@ApiResponse({ status: 400, description: "Invalid request" })
	@ApiResponse({ status: 201, description: "Product successfully created" })
	@ApiCookieAuth("access")
	@ApiBody({ type: ProductCreateBodyDTO, required: true })
	@HttpCode(201)
	@Post("")
	@Role(0)
	@UseGuards(AccessGuard, RoleGuard)
	@ApiConsumes("multipart/form-data")
	@UseInterceptors(FilesInterceptor("images"))
	async create(@Body() body: ProductCreateBodyDTO, @UploadedFiles() files: Array<Express.Multer.File>) {
		return await this.productService.create(body, files)
	}

	@ApiResponse({ status: 400, description: "Invalid request" })
	@ApiResponse({ status: 200, description: "List of products" })
	@HttpCode(200)
	@Get("all")
	@Role(0)
	@UseGuards(RoleGuard)
	async get(@Query() query: ProductGetQueryDTO) {
		return await this.productService.get(query)
	}

	@ApiResponse({ status: 400, description: "Invalid request" })
	@ApiResponse({ status: 200, description: "Info about product" })
	@HttpCode(200)
	@Get(":id")
	@Role(0)
	@UseGuards(RoleGuard)
	async id(@Param() param: ProductGetParamDTO) {
		return await this.productService.id(param)
	}
	
	@ApiResponse({ status: 400, description: "Invalid request" })
	@ApiResponse({ status: 200, description: "Product successfully deleted" })
	@ApiCookieAuth("access")
	@ApiBody({ type: ProductDelBodyDTO, required: true })
	@HttpCode(200)
	@Delete("")
	@Role(0)
	@UseGuards(AccessGuard, RoleGuard)
	async del(@Body() body: ProductDelBodyDTO) {
		return await this.productService.del(body)
	}
}