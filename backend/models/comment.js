import mongoose, { Schema, model } from "mongoose";

// Define the schema for replies
const replySchema = new Schema({
  content: { type: String, required: true },
  replyAuthorId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  replyAuthorName: {
    type: String,
    required: true,
  },
  mentionedUserId: {
    type: mongoose.Types.ObjectId,
    ref: "User", // Reference to the mentioned user
  },
  mentionedUserName: {
    type: String,
    // Optional, can be removed if not needed
  },
  createdAt: { type: Date, default: Date.now },
});
// Define the schema for comments
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

    replies: [replySchema], // Use the reply schema as a subdocument
  },
  { timestamps: true }
);

export default model("Comment", commentSchema);
