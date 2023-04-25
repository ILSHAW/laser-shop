import { IsNotEmpty, IsString, validateSync } from "class-validator"
import { ExecutionContext, Injectable } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { Request } from "express"

import { ExceptionService } from "../services/exception.service"

export class RefreshDTO {
	@IsString({ message: "Refresh cookie must be a string" })
	@IsNotEmpty({ message: "Refresh cookie is required" })
	refresh: string

	constructor(data: RefreshDTO) {
		this.refresh = data.refresh
	}
}

@Injectable()
export class RefreshGuard extends AuthGuard("refresh") {
	constructor(private readonly exceptionService: ExceptionService) {
		super()
	}

	canActivate(context: ExecutionContext) {
		this.validateRequest(context.switchToHttp().getRequest<Request>())

		return super.canActivate(context)
	}
	validateRequest(req: Request) {
		const errors = validateSync(new RefreshDTO(req.cookies))

		if (errors.length !== 0) {
			throw this.exceptionService.validation(errors[0])
		}
	}
}