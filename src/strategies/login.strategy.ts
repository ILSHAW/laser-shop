import { PassportStrategy } from "@nestjs/passport"
import { InjectModel } from "@nestjs/mongoose"
import { Injectable } from "@nestjs/common"
import { Strategy } from "passport-local"
import * as argon from "argon2"

import { ExceptionService } from "../services/exception.service"
import { IUserModel } from "../models/user.model"

@Injectable()
export class LoginStrategy extends PassportStrategy(Strategy, "login") {
	constructor(private readonly exceptionService: ExceptionService, @InjectModel("User") private readonly userModel: IUserModel) {
		super({
			usernameField: "login",
			passwordField: "password"
		})
	}
	async validate(login: string, password: string) {
		const user = await this.userModel.findOne({ login })

		if (user) {
			const verified = await argon.verify(user.password, password)

			if (verified) {
				return user
			} 
			else {
				throw this.exceptionService.forbidden("Bad password")
			}
		} 
		else {
			throw this.exceptionService.notFound("User not found")
		}
	}
}