import { Injectable } from "@nestjs/common"
import * as jwt from "jsonwebtoken"
import * as path from "path"
import * as fs from "fs"

interface Payload {
	[key: string]: any
}

@Injectable()
export class JwtService {
	private readonly key = fs.readFileSync(path.resolve("keys/private.pem"))

	access(payload: Payload) {
		return jwt.sign(payload, this.key, { expiresIn: 15 * 60, algorithm: "RS256" })
	}
	refresh(payload: Payload) {
		return jwt.sign(payload, this.key, { expiresIn: 24 * 60 * 60, algorithm: "RS256" })
	}
}
