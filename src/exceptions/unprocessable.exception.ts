import { HttpStatus, HttpException } from "@nestjs/common"

export class UnprocessableException extends HttpException {
	constructor(message: string, status: HttpStatus = HttpStatus.UNPROCESSABLE_ENTITY) {
		super({ message }, status)
	}
}
