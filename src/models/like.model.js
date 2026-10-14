import mongoose, {Schema} from "mongoose";

const likeSchema = new Schema (
    {
        comment: {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        },
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video"
        },
        liked: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        instagram: {
            type: Schema.Types.ObjectId,
            ref: "Instagram"
        }
    },
    {timestamps:true}
)

export const Like = mongoose.model("Like", likeSchema)