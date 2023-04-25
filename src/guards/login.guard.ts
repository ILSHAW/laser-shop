import { IsNotEmpty, IsString, validateSync } from "class-validator"
import { ExecutionContext, Injectable } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { Request } from "express"

import { ExceptionService } from "../services/exception.service"

class LoginDTO {
	@IsString({ message: "Login must be a string" })
	@IsNotEmpty({ message: "Login field is required" })
	login: string
	@IsString({ message: "Password must be a string" })
	@IsNotEmpty({ message: "Password field is required" })
	password: string

	constructor(data: LoginDTO) {
		this.login = data.login
		this.password = data.password
	}
}

@Injectable()
export class LoginGuard extends AuthGuard("login") {
	constructor(private readonly exceptionService: ExceptionService) {
		super()
	}

	canActivate(context: ExecutionContext) {
		this.validateRequest(context.switchToHttp().getRequest<Request>())

		return super.canActivate(context)
	}
	validateRequest(req: Request) {
		const errors = validateSync(new LoginDTO(req.body))

		if (errors.length !== 0) {
			throw this.exceptionService.validation(errors[0])
		}
	}
}