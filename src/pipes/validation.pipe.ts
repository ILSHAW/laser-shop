import { ValidationPipe as BaseValidationPipe, Injectable } from "@nestjs/common"
import { ValidationError } from "class-validator"

import { ExceptionService } from "../services/exception.service"

@Injectable()
export class ValidationPipe extends BaseValidationPipe {
	private readonly exceptionService = new ExceptionService()

	constructor() {
		super({
			exceptionFactory: (errors: ValidationError[]) => this.exceptionService.validation(errors[0])
		})
	}
}