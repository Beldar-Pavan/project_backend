import mongoose, {Schema} from "mongoose";

const youtubeSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video"
        },
        username: {
            type: String,
            unique: true,
            required: true,
            lowercase: true
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            required: true
        },
        fullName: {
            type: String,
            required: true
        }
    },
    {timestamps: true}
)

export const YouTube = mongoose.model("YouTube", youtubeSchema)