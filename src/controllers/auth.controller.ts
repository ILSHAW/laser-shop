import { Controller, Post, Body, HttpCode, Get, UseGuards, Req, Res } from "@nestjs/common"
import { ApiTags, ApiBody, ApiResponse, ApiCookieAuth } from "@nestjs/swagger"
import { Request, Response } from "express"

import { AuthService, AuthSignupBodyDTO, AuthLoginBodyDTO } from "../services/auth.service"
import { SignupGuard } from "../guards/signup.guard"
import { AccessGuard } from "../guards/access.guard"
import { Role } from "../decorators/role.decorator"
import { LoginGuard } from "../guards/login.guard"
import { RoleGuard } from "../guards/role.guard"

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiResponse({ status: 400, description: "Invalid request" })
    @ApiResponse({ status: 201, description: "User successfully created" })
	@ApiBody({ type: AuthSignupBodyDTO, required: true })
	@HttpCode(201)
	@Post("signup")
	@Role(0)
	@UseGuards(SignupGuard, RoleGuard)
	async signup(@Body() body: AuthSignupBodyDTO) {
		return await this.authService.signup(body)
	}

	@ApiResponse({ status: 400, description: "Invalid request" })
	@ApiResponse({ status: 200, description: "User successfully authenticated" })
	@ApiBody({ type: AuthLoginBodyDTO, required: true })
	@HttpCode(200)
	@Post("login")
	@Role(0)
	@UseGuards(LoginGuard, RoleGuard)
	async login(@Req() req: Request, @Res({ passthrough: true }) res: Response, @Body() body: AuthLoginBodyDTO) {
		return await this.authService.login(req, res, body)
	}

	@ApiResponse({ status: 400, description: "Invalid request" })
	@ApiResponse({ status: 200, description: "User successfully logged out" })
	@ApiCookieAuth("access")
	@HttpCode(200)
	@Get("logout")
	@Role(0)
	@UseGuards(AccessGuard, RoleGuard)
	async logout(@Res({ passthrough: true }) res: Response) {
		return await this.authService.logout(res)
	}
}