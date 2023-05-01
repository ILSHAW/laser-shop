import { Injectable } from "@nestjs/common"
import { Request, Response } from "express"

import { JwtService } from "../services/jwt.service"

@Injectable()
export class TokenService {
	constructor(private readonly jwtService: JwtService) {}

    async refresh(req: Request, res: Response) {
        res.cookie("access", this.jwtService.access({ id: req.user.id }), { maxAge: 15 * 60 * 1000, httpOnly: true, sameSite: "lax" })
		res.cookie("refresh", this.jwtService.refresh({ id: req.user.id }), { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "lax" })

		return { message: "Tokens successfully refreshed" }
    }
}