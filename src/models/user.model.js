import mongoose, {Schema} from "mongoose";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true
        },
        fullName: {
            type: String,
            required: true
        },
        avatar: {
            type: String
        },
        coverImage: {
            type: String
        },
        password: {
            type: String,
            required: true
        }
    },
    {timestamps: true}
)

export const User = mongoose.model("User", userSchema)