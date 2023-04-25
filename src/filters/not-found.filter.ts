import { ExceptionFilter, Catch, ArgumentsHost, NotFoundException } from "@nestjs/common"
import { Response } from "express"

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
	catch(exception: NotFoundException, host: ArgumentsHost) {
		return host.switchToHttp().getResponse<Response>().status(404).send({ message: "Route not found" })
	}
}
