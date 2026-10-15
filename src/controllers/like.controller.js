import mongoose from "mongoose";
import { Like } from "../models/like.model.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

export const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id || req.user.id;

    if (!isValidId(postId)) {
      return res.status(400).json({ success: false, message: "Invalid post id, check your post id" });
    }

    const existing = await Like.findOne({ user: userId, post: postId });

    if (existing) {
      await existing.deleteOne();
      const count = await Like.countDocuments({ post: postId });
      return res.status(200).json({
        success: true,
        liked: false,
        likesCount: count,
        message: "Post unliked",
      });
    }

    await Like.create({ user: userId, post: postId });
    const count = await Like.countDocuments({ post: postId });

    return res.status(201).json({
      success: true,
      liked: true,
      likesCount: count,
      message: "Post liked",
    });
  } catch (error) {
    console.error("toggleLike error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getLikeStatus = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id || req.user.id;

    if (!isValidId(postId)) {
      return res.status(400).json({ success: false, message: "Invalid post id" });
    }

    const [count, mine] = await Promise.all([
      Like.countDocuments({ post: postId }),
      Like.exists({ user: userId, post: postId }),
    ]);

    return res.status(200).json({
      success: true,
      likesCount: count,
      likedByMe: Boolean(mine),
    });
  } catch (error) {
    console.error("getLikeStatus error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getPostLikes = async (req, res) => {
  try {
    const { postId } = req.params;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);

    if (!isValidId(postId)) {
      return res.status(400).json({ success: false, message: "Invalid post id" });
    }

    const likes = await Like.find({ post: postId })
      .populate("user", "name username avatar")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Like.countDocuments({ post: postId });

    return res.status(200).json({
      success: true,
      page,
      limit,
      total,
      users: likes.map((l) => l.user),
    });
  } catch (error) {
    console.error("getPostLikes error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};