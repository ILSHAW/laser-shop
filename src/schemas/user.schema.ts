import { Document, Schema } from "mongoose"

interface IUser {
	login: string
	password: string
	role: number
}

export interface IUserDocument extends IUser, Document {}

export const UserSchema = new Schema<IUserDocument>({
	login: { type: Schema.Types.String },
	password: { type: Schema.Types.String },
	role: { type: Schema.Types.Number, default: 1 }
})