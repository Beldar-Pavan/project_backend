import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!isValidId(postId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid post id" });
    }

    if (!content || !content.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Comment content is required" });
    }

    const comment = await Comment.create({
      content: content.trim(),
      video: postId,
      owner: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Comment uploaded successfully",
      data: comment,
    });
  } catch (error) {
    console.error("createComment error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
 
    if (!isValidId(postId)) {
      return res.status(400).json({ success: false, message: "Invalid post id" });
    }
 
    const [comments, total] = await Promise.all([
      Comment.find({ video: postId })
        .populate("owner", "username email")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Comment.countDocuments({ video: postId }),
    ]);
 
    return res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(total / limit),
      total,
      data: comments,
    });
  } catch (error) {
    console.error("getCommentsByPost error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
 
    if (!isValidId(commentId)) {
      return res.status(400).json({ success: false, message: "Invalid comment id" });
    }
 
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: "Comment content is required" });
    }
 
    const comment = await Comment.findById(commentId);
 
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not allowed to edit this comment" });
    }
 
    comment.content = content.trim();
    await comment.save();
 
    return res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      data: comment,
    });
  } catch (error) {
    console.error("updateComment error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
 
export { createComment, getCommentsByPost, updateComment };
 