import Comment from "../models/comment.js";
import { User } from "../models/user.js";

export const createComment = async (req, res) => {
  try {
    const { content, postId, userId } = req.body;
    // const userId = req.user._id; // Assuming you have user authentication middleware

    // Validate input
    if (!content || !postId || !userId) {
      return res
        .status(400)
        .json({ message: "Content and postId are required" });
    }
    const username = await User.findById(userId).select("username");
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
export const editComment = async (req, res) => {
  try {
    const { commentId, content } = req.body;
    const comments = await Comment.findOneAndUpdate(
      { _id: commentId },
      { content: content }
    );

    if (!comments) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Update the post to remove the deleted comment
    // await Post.findByIdAndUpdate(postId, {
    //   $pull: { comments: commentId },
    // });

    res.status(200).json({ message: "Comment updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const likeComment = async (req, res) => {
  try {
    const { commentId, userId } = req.body;

    // Find the comment
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the user has already liked the comment
    const hasLiked = comment.likes.includes(userId);

    if (hasLiked) {
      // If already liked, remove the like
      comment.likes = comment.likes.filter((id) => id.toString() !== userId);
    } else {
      // If not liked, add the like
      comment.likes.push(userId);
    }

    // Save the comment
    await comment.save();

    res.status(200).json({
      message: hasLiked ? "Like removed" : "Liked",
      likes: comment.likes.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const replyComment = async (req, res) => {
  try {
    const { content, replierId, recipientId } = req.body;
    const { commentId } = req.params;

    // Validate input
    if (!content || !replierId || !commentId || !recipientId) {
      return res.status(400).json({
        message: "Content, replierId, commentId and recipientId are required",
      });
    }

    // Get author details
    const user = await User.findById(replierId).select("username");
    const mentionedUser = recipientId
      ? await User.findById(recipientId).select("username")
      : null;

    // Create the reply
    const reply = {
      content,
      replyAuthorId: replierId,
      replyAuthorName: user.username,
      mentionedUserId: recipientId || null,
      mentionedUserName: mentionedUser ? mentionedUser.username : null,
      createdAt: new Date(),
    };

    // Find the comment and add the reply
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.replies.push(reply);
    await comment.save();

    res.status(201).json({ message: "Reply added successfully", reply });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const replyCommentDelete = async (req, res) => {
  try {
    const { replyId, commentId } = req.params;

    // Find the comment and remove the reply
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.replies = comment.replies.filter(
      (reply) => reply._id.toString() !== replyId
    );
    await comment.save();

    res.status(200).json({ message: "Reply deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
