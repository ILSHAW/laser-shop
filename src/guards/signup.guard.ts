import { IsNotEmpty, IsString, validateSync } from "class-validator"
import { ExecutionContext, Injectable } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { Request } from "express"

import { ExceptionService } from "../services/exception.service"

class SignupDTO {
	@IsString({ message: "Login field must be a string" })
	@IsNotEmpty({ message: "Login field is required" })
	login: string
	@IsString({ message: "Password field must be a string" })
	@IsNotEmpty({ message: "Password field is required" })
	password: string

	constructor(data: SignupDTO) {
		this.login = data.login
		this.password = data.password
	}
}

@Injectable()
export class SignupGuard extends AuthGuard("signup") {
	constructor(private readonly exceptionService: ExceptionService) {
		super()
	}

	canActivate(context: ExecutionContext) {
		this.validateRequest(context.switchToHttp().getRequest<Request>())

		return super.canActivate(context)
	}
	validateRequest(req: Request) {
		const errors = validateSync(new SignupDTO(req.body))

		if (errors.length !== 0) {
			throw this.exceptionService.validation(errors[0])
		}
	}
}