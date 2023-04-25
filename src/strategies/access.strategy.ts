import { PassportStrategy } from "@nestjs/passport"
import { Strategy, ExtractJwt } from "passport-jwt"
import { InjectModel } from "@nestjs/mongoose"
import { Injectable } from "@nestjs/common"
import { Request } from "express"
import * as path from "path"
import * as fs from "fs"

import { ExceptionService } from "../services/exception.service"
import { IUserModel } from "../models/user.model"

interface Payload {
	id: string
}

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, "access") {
	constructor(private readonly exceptionService: ExceptionService, @InjectModel("User") private readonly userModel: IUserModel) {
		super({
			secretOrKey: fs.readFileSync(path.resolve("keys/public.pem")),
			jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => req.cookies["access"]])
		})
	}
	async validate(payload: Payload) {
		const user = await this.userModel.findById(payload.id)

		if (user) {
			return user
		} 
		else {
			throw this.exceptionService.notFound("User not found")
		}
	}
}