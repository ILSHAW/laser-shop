import { Document, Schema } from "mongoose"

interface ICategory {
	name: string
}

export interface ICategoryDocument extends ICategory, Document {}

export const CategorySchema = new Schema<ICategoryDocument>({
	name: { type: Schema.Types.String }
})