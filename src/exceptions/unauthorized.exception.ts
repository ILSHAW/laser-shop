import { HttpStatus, HttpException } from "@nestjs/common"

export class UnauthorizedException extends HttpException {
	constructor(message: string, status: HttpStatus = HttpStatus.UNAUTHORIZED) {
		super({ message }, status)
	}
}
