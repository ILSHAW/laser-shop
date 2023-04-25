import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common"
import { Response } from "express"

import { InternalServerErrorException } from "../exceptions/internal-server-error.exception"
import { UnprocessableException } from "../exceptions/unprocessable.exception"
import { UnauthorizedException } from "../exceptions/unauthorized.exception"
import { BadRequestException } from "../exceptions/bad-request.exception"
import { ValidationException } from "../exceptions/validation.exception"
import { ForbiddenException } from "../exceptions/forbidden.exception"
import { NotFoundException } from "../exceptions/not-found.exception"
import { ConflictException } from "../exceptions/conflict.exception"

type HttpException =
	| InternalServerErrorException
	| UnprocessableException
	| UnauthorizedException
	| ValidationException
	| BadRequestException
	| ForbiddenException
	| ConflictException
	| NotFoundException

const HttpException = [
	InternalServerErrorException,
	UnprocessableException,
	UnauthorizedException,
	ValidationException,
	BadRequestException,
	ForbiddenException,
	ConflictException,
	NotFoundException,
]

@Catch(...HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		return host.switchToHttp().getResponse<Response>().status(exception.getStatus()).send(exception.getResponse())
	}
}
