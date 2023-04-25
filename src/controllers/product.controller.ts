import { Controller, Post, Body, HttpCode, Get, Delete, UseGuards, Query, UseInterceptors, UploadedFile, UploadedFiles } from "@nestjs/common"
import { ApiTags, ApiResponse, ApiBody, ApiCookieAuth, ApiQuery, ApiConsumes } from "@nestjs/swagger"
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express"

import { ProductService, ProductCreateBodyDTO, ProductGetQueryDTO, ProductDelBodyDTO } from "../services/product.service"
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
	@ApiQuery({ type: ProductGetQueryDTO, required: true })
	@HttpCode(200)
	@Get("")
	@Role(0)
	@UseGuards(RoleGuard)
	async get(@Query() query: ProductGetQueryDTO) {
		return await this.productService.get(query)
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