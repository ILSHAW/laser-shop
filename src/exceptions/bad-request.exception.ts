import { HttpStatus, HttpException } from "@nestjs/common"

export class BadRequestException extends HttpException {
	constructor(message: string, status: HttpStatus = HttpStatus.BAD_REQUEST) {
		super({ message }, status)
	}
}
