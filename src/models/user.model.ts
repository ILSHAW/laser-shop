import { Model } from "mongoose"

import { IUserDocument } from "../schemas/user.schema"

export interface IUserModel extends Model<IUserDocument> {}