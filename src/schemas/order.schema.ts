import { Document, Schema } from "mongoose"

interface IOrder {
	customer: Schema.Types.ObjectId,
    products: Array<Schema.Types.ObjectId>,
    paid: boolean
}

export interface IOrderDocument extends IOrder, Document {}

export const OrderSchema = new Schema<IOrderDocument>({
	customer: { type: Schema.Types.ObjectId, ref: "User" },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    paid: { type: Schema.Types.Boolean, default: false }
})