import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common"
import { Response } from "express"

@Catch()
export class EverythingExceptionsFilter implements ExceptionFilter {
	catch(exception: any, host: ArgumentsHost) {
		
		console.log(exception)

		return host.switchToHttp().getResponse<Response>().status(500).send({ message: "Internal server error" })
	}
}
