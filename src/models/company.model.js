import mongoose, {Schema} from "mongoose";

const companySchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        address: {
            type: String,
            default: none
        },
        worker: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {timestamps: true}
)

export const Company = mongoose.model("Company", companySchema)