import mongoose, { Schema, model } from "mongoose";

const commentSchema = new Schema(
  {
    content: { type: String, required: true },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    authorname: {
      type: String,
      required: true,
    },
    post: {
      type: mongoose.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    
    dislikes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    replies: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

export default model("Comment", commentSchema);
