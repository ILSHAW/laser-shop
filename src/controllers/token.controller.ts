import { Controller, Get, UseGuards, Req, Res } from "@nestjs/common"
import { ApiTags, ApiResponse, ApiCookieAuth } from "@nestjs/swagger"
import { Request, Response } from "express"

import { TokenService } from "../services/token.service"
import { RefreshGuard } from "../guards/refresh.guard"
import { Role } from "../decorators/role.decorator"
import { RoleGuard } from "../guards/role.guard"

@ApiTags("Token")
@Controller("token")
export class TokenController {
	constructor(private readonly tokenService: TokenService) {}

    @ApiResponse({ status: 400, description: "Invalid request" })
    @ApiResponse({ status: 200, description: "Tokens successfully refreshed" })
    @ApiCookieAuth("refresh")
    @Get("refresh")
    @Role(0)
    @UseGuards(RefreshGuard, RoleGuard)
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        return await this.tokenService.refresh(req, res)
    }
}