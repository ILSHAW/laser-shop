import { Model } from "mongoose"

import { ISubcategoryDocument } from "../schemas/subcategory.schema"

export interface ISubcategoryModel extends Model<ISubcategoryDocument> {}