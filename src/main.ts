import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import { ConfigService } from "@nestjs/config"
import { NestFactory } from "@nestjs/core"
import * as cookies from "cookie-parser"
import { Logger } from "@nestjs/common"

import { EverythingExceptionsFilter } from "./filters/everything-exceptions.filter"
import { HttpExceptionsFilter } from "./filters/http-exceptions.filter"
import { NotFoundExceptionFilter } from "./filters/not-found.filter"
import { ValidationPipe } from "./pipes/validation.pipe"
import { AppModule } from "./modules/app.module"

async function bootstrap() {
  	const options = new DocumentBuilder().setTitle("Server API").setVersion("1.0.0").addCookieAuth("access").build()
  	const app = await NestFactory.create(AppModule)
  	const config = app.get(ConfigService)
	const logger = new Logger("SERVER")
	const document = SwaggerModule.createDocument(app, options)

  	SwaggerModule.setup("swagger", app, document)

  	app.useGlobalFilters(new EverythingExceptionsFilter(), new HttpExceptionsFilter(), new NotFoundExceptionFilter())
	app.useGlobalPipes(new ValidationPipe())
  	app.use(cookies())

  	await app.listen(config.get("app.port"), () => logger.log(`Server is running on http://127.0.0.1:${config.get("app.port")}`))
}
bootstrap()
