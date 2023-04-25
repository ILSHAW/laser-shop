import { Module } from "@nestjs/common"

import { SubcategoryDatabaseModule, ProductDatabaseModule } from "../modules/database.module"
import { ProductController } from "../controllers/product.controller"
import { ProductService } from "../services/product.service"
import { ExceptionService } from "../services/exception.service"

@Module({
	imports: [SubcategoryDatabaseModule, ProductDatabaseModule],
	controllers: [ProductController],
	providers: [ProductService, ExceptionService]
})
export class ProductModule {}