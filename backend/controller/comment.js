import Comment from "../models/comment.js";
import { User } from "../models/user.js";

export const createComment = async (req, res) => {
  try {
    const { content, postId } = req.body;
    const userId = req.user._id; // Assuming you have user authentication middleware

    // Validate input
    if (!content || !postId) {
      return res
        .status(400)
        .json({ message: "Content and postId are required" });
    }
    const username = await User.findById(userId).select("username");
    console.log(username);
    // Create the comment
    const comment = new Comment({
      content,
      author: userId,
      authorname: username.username,
      post: postId,
    });

    // Save the comment
    await comment.save();

    // Update the post to include the new comment
    // await Post.findByIdAndUpdate(postId, {
    //   $push: { comments: comment._id },
    // });

    res.status(201).json({ message: "Comment created successfully", comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId });

    res
      .status(200)
      .json({ message: "Comments fetched successfully", comments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comments = await Comment.deleteOne({ _id: commentId });

    if (!comments) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Update the post to remove the deleted comment
    // await Post.findByIdAndUpdate(postId, {
    //   $pull: { comments: commentId },
    // });

    res.status(200).json({ message: "Comment deleted successfully" });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
