import { HttpStatus, HttpException } from "@nestjs/common"
import { ValidationError } from "class-validator"

export class ValidationException extends HttpException {
	constructor(error: ValidationError, status: HttpStatus = HttpStatus.BAD_REQUEST) {
		super({ message: Object.values(error.constraints)[0] }, status)
	}
}
