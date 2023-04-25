import { InjectModel } from "@nestjs/mongoose"
import { ApiProperty } from "@nestjs/swagger"
import { Injectable } from "@nestjs/common"
import { Request, Response } from "express"
import * as argon from "argon2"

import { JwtService } from "../services/jwt.service"
import { IUserModel } from "../models/user.model"

export class AuthSignupBodyDTO {
	@ApiProperty({ description: "Email", example: "example@example.com" })
	login: string
	@ApiProperty({ description: "Password", example: "12345678" })
	password: string
}
export class AuthLoginBodyDTO {
	@ApiProperty({ description: "Email", example: "example@example.com" })
	login: string
	@ApiProperty({ description: "Password", example: "12345678" })
	password: string
}

@Injectable()
export class AuthService {
	constructor(private readonly jwtService: JwtService, @InjectModel("User") private readonly userModel: IUserModel) {}

	async signup(body: AuthSignupBodyDTO) {
		await this.userModel.create({
			login: body.login,
			password: await argon.hash(body.password),
		})

		return { message: "User successfully created" }
	}
	async login(req: Request, res: Response, body: AuthLoginBodyDTO) {
		res.cookie("access", this.jwtService.access({ id: req.user.id }), { maxAge: 15 * 60 * 1000 })
		res.cookie("refresh", this.jwtService.refresh({ id: req.user.id }), { maxAge: 24 * 60 * 60 * 1000 })

		return { message: "User successfully authenticated" }
	}
	async logout(res: Response) {
		res.clearCookie("access")
		res.clearCookie("refresh")

		return { message: "User successfully logged out" }
	}
}