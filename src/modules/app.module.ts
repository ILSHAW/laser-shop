import { Module } from "@nestjs/common"

import { SubcategoryModule } from "../modules/subcategory.module"
import { DatabaseModule } from "../modules/database.module"
import { CategoryModule } from "../modules/category.module"
import { ProductModule } from "../modules/product.module"
import { ConfigModule } from "../modules/config.module"
import { TokenModule } from "../modules/token.module"
//import { OrderModule } from "../modules/order.module"
import { AuthModule } from "../modules/auth.module"

@Module({
	imports: [
		SubcategoryModule,
		DatabaseModule,
		CategoryModule,
		ProductModule,
		ConfigModule,
		TokenModule,
		//OrderModule,
		AuthModule
	]
})
export class AppModule {}