import { Module } from "@nestjs/common"

import { OrderController } from "../controllers/order.controller"
import { OrderDatabaseModule } from "../modules/database.module"
import { ExceptionService } from "../services/exception.service"
import { OrderService } from "../services/order.service"

@Module({
	imports: [OrderDatabaseModule],
	controllers: [OrderController],
	providers: [ExceptionService, OrderService]
})
export class OrderModule {}