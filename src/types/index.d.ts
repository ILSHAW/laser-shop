import { IUserDocument } from "../schemas/user.schema"

declare global {
	namespace Express {
		export interface User extends IUserDocument {}
		export interface Request {
			user?: User
		}
	}
}
