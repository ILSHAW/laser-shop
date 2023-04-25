import { Model } from "mongoose"

import { IProductDocument } from "../schemas/product.schema"

export interface IProductModel extends Model<IProductDocument> {}