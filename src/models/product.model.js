import mongoose, {Schema} from "mongoose";

const productSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        name: {
            type: String,
            lowercase: true,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        imageUrl: {
            type: String,
            lowercase: true,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        stock: {
            type: Number,
            default: 0,
            required: true
        },
        category: {
            type: String,
            required: true,
            enum: ["mic", "camera", "device", "other"],
            lowercase: true
        },
        isActive: {
            type: Boolean,
            default: true,
            required: true,
            lowercase: true
        },
        seller: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        company: {
            type: Schema.Types>ObjectId,
            ref: "Company",
            required: true,
        }
    },
    {timestamps: true}
)

export const Product = mongoose.model("Product", productSchema)