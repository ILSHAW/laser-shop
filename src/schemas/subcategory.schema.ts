import { Document, Schema } from "mongoose"

interface ISubcategory {
	name: string
	category: Schema.Types.ObjectId
}

export interface ISubcategoryDocument extends ISubcategory, Document {}

export const SubcategorySchema = new Schema<ISubcategoryDocument>({
	name: { type: Schema.Types.String },
	category: { type: Schema.Types.ObjectId, ref: "Category" }
})