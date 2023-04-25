import { Document, Schema } from "mongoose"

interface IProduct {
	name: string
	category: Schema.Types.ObjectId
	subcategory: Schema.Types.ObjectId
	color: string
	price: number
	cover: string
	images: Array<string>
}

export interface IProductDocument extends IProduct, Document {}

export const ProductSchema = new Schema<IProductDocument>({
	name: { type: Schema.Types.String },
	category: { type: Schema.Types.ObjectId },
	subcategory: { type: Schema.Types.ObjectId },
	color: { type: Schema.Types.String },
	price: { type: Schema.Types.Number },
	cover: { type: Schema.Types.String },
	images: [{ type: Schema.Types.String }]
})