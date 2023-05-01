import { MongooseModule } from "@nestjs/mongoose"
import { ConfigService } from "@nestjs/config"
import { Module } from "@nestjs/common"

import { SubcategorySchema } from "../schemas/subcategory.schema"
import { CategorySchema } from "../schemas/category.schema"
import { ProductSchema } from "../schemas/product.schema"
import { ConfigModule } from "../modules/config.module"
import { OrderSchema } from "../schemas/order.schema"
import { UserSchema } from "../schemas/user.schema"

const databaseModule = MongooseModule.forRootAsync({
	imports: [ConfigModule],
	useFactory: (config: ConfigService) => ({ 
		uri: `mongodb://${config.get("database.host")}:${config.get("database.port")}/${config.get("database.name")}`
	}),
    inject: [ConfigService]
})

const subcategoryDatabaseModule = MongooseModule.forFeature([{ name: "Subcategory", schema: SubcategorySchema }])
const categoryDatabaseModule = MongooseModule.forFeature([{ name: "Category", schema: CategorySchema }])
const productDatabaseModule = MongooseModule.forFeature([{ name: "Product", schema: ProductSchema }])
const orderDatabaseModule = MongooseModule.forFeature([{ name: "Order", schema: OrderSchema }])
const userDatabaseModule = MongooseModule.forFeature([{ name: "User", schema: UserSchema }])

@Module({
	imports: [databaseModule],
	exports: [databaseModule]
})
export class DatabaseModule {}

@Module({
	imports: [userDatabaseModule],
	exports: [userDatabaseModule],
})
export class UserDatabaseModule {}

@Module({
	imports: [categoryDatabaseModule],
	exports: [categoryDatabaseModule]
})
export class CategoryDatabaseModule {}

@Module({
	imports: [subcategoryDatabaseModule],
	exports: [subcategoryDatabaseModule]
})
export class SubcategoryDatabaseModule {}

@Module({
	imports: [productDatabaseModule],
	exports: [productDatabaseModule]
})
export class ProductDatabaseModule {}

@Module({
	imports: [orderDatabaseModule],
	exports: [orderDatabaseModule]
})
export class OrderDatabaseModule {}