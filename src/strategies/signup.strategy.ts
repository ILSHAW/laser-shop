import { PassportStrategy } from "@nestjs/passport"
import { InjectModel } from "@nestjs/mongoose"
import { Injectable } from "@nestjs/common"
import { Strategy } from "passport-local"

import { ExceptionService } from "../services/exception.service"
import { IUserModel } from "../models/user.model"

@Injectable()
export class SignupStrategy extends PassportStrategy(Strategy, "signup") {
	constructor(private readonly exceptionService: ExceptionService, @InjectModel("User") private readonly userModel: IUserModel) {
		super({
			usernameField: "login",
			passwordField: "password"
		})
	}
	async validate(login: string) {
		const user = await this.userModel.findOne({ login })

		if (user) {
			throw this.exceptionService.conflict("Login already taken")
		} 
		else {
			return true
		}
	}
}