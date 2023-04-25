import { HttpStatus, HttpException } from "@nestjs/common"

export class InternalServerErrorException extends HttpException {
	constructor(message: string, status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR) {
		super({ message }, status)
	}
}
