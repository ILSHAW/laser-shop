import { Model } from "mongoose"

import { ICategoryDocument } from "../schemas/category.schema"

export interface ICategoryModel extends Model<ICategoryDocument> {}