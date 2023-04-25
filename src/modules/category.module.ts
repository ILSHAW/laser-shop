import { Module } from "@nestjs/common"

import { CategoryDatabaseModule, SubcategoryDatabaseModule, ProductDatabaseModule } from "../modules/database.module"
import { CategoryController } from "../controllers/category.controller"
import { ExceptionService } from "../services/exception.service"
import { CategoryService } from "../services/category.service"

@Module({
	imports: [CategoryDatabaseModule, SubcategoryDatabaseModule, ProductDatabaseModule],
	controllers: [CategoryController],
	providers: [ExceptionService, CategoryService]
})
export class CategoryModule {}