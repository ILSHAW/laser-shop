import { IsNotEmpty, IsString, validateSync } from "class-validator"
import { ExecutionContext, Injectable } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { Request } from "express"

import { ExceptionService } from "../services/exception.service"

class AccessDTO {
	@IsString({ message: "Access cookie must be a string" })
	@IsNotEmpty({ message: "Access cookie is required" })
	access: string

	constructor(data: AccessDTO) {
		this.access = data.access
	}
}

@Injectable()
export class AccessGuard extends AuthGuard("access") {
	constructor(private readonly exceptionService: ExceptionService) {
		super()
	}

	canActivate(context: ExecutionContext) {
		this.validateRequest(context.switchToHttp().getRequest<Request>())

		return super.canActivate(context)
	}
	validateRequest(req: Request) {
		const errors = validateSync(new AccessDTO(req.cookies))

		if (errors.length !== 0) {
			throw this.exceptionService.validation(errors[0])
		}
	}
}