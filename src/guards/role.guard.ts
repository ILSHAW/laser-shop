import { ExecutionContext, Injectable, CanActivate } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { Request } from "express"

import { ExceptionService } from "../services/exception.service"

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private readonly exceptionService: ExceptionService, private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext) {
		const roles = this.reflector.get<Array<number>>("roles", context.getHandler())
		const req = context.switchToHttp().getRequest<Request>()

		if (roles.includes(0)) {
			return true
		} 
		else {
			if (roles.includes(req.user.role)) {
				return true
			} else {
				throw this.exceptionService.forbidden("Access denied")
			}
		}
	}
}
