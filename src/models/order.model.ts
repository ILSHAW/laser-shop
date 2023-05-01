import { Model } from "mongoose"

import { IOrderDocument } from "../schemas/order.schema"

export interface IOrderModel extends Model<IOrderDocument> {}