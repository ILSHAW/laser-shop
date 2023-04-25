import { Module } from "@nestjs/common"

import { CategoryDatabaseModule, SubcategoryDatabaseModule, ProductDatabaseModule } from "../modules/database.module"
import { SubcategoryController } from "../controllers/subcategory.controller"
import { SubcategoryService } from "../services/subcategory.service"
import { ExceptionService } from "../services/exception.service"

@Module({
	imports: [SubcategoryDatabaseModule, CategoryDatabaseModule, ProductDatabaseModule],
	controllers: [SubcategoryController],
	providers: [SubcategoryService, ExceptionService]
})
export class SubcategoryModule {}