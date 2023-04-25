import { HttpStatus, HttpException } from "@nestjs/common"

export class ConflictException extends HttpException {
	constructor(message: string, status: HttpStatus = HttpStatus.CONFLICT) {
		super({ message }, status)
	}
}
