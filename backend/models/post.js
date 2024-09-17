import mongoose, { Schema, model } from "mongoose";

const Post = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    frontImage: {
      type: String,
      required: true,
      //   unique: true,
      // index:true
    },
    
  },
  { timestamps: true }
);

export default model("Post", Post);
