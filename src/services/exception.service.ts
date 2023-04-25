import { ValidationError } from "class-validator"
import { Injectable } from "@nestjs/common"

import { InternalServerErrorException } from "../exceptions/internal-server-error.exception"
import { UnprocessableException } from "../exceptions/unprocessable.exception"
import { UnauthorizedException } from "../exceptions/unauthorized.exception"
import { BadRequestException } from "../exceptions/bad-request.exception"
import { ValidationException } from "../exceptions/validation.exception"
import { ForbiddenException } from "../exceptions/forbidden.exception"
import { NotFoundException } from "../exceptions/not-found.exception"
import { ConflictException } from "../exceptions/conflict.exception"

@Injectable()
export class ExceptionService {
	internalServerError(message: string) {
		return new InternalServerErrorException(message)
	}
	unauthorized(message: string) {
		return new UnauthorizedException(message)
	}
	badRequest(message: string) {
		return new BadRequestException(message)
	}
	forbidden(message: string) {
		return new ForbiddenException(message)
	}
	conflict(message: string) {
		return new ConflictException(message)
	}
	notFound(message: string) {
		return new NotFoundException(message)
	}
	unprocessable(message: string) {
		return new UnprocessableException(message)
	}
	validation(error: ValidationError) {
		return new ValidationException(error)
	}
}