import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (buffer, folder = "instagram_posts") =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const createPost = async (req, res) => {
  try {
    const { caption } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const result = await uploadToCloudinary(req.file.buffer);

    const post = await Post.create({
      user: req.user.id,
      caption: caption || "",
      imageUrl: result.secure_url,
      imagePublicId: result.public_id,
    });

    return res.status(201).json({ success: true, post });
  } catch (error) {
    console.error("createPost error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getFeed = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);

    const [posts, total] = await Promise.all([
      Post.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("user", "username avatar"),
      Post.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(total / limit),
      total,
      posts,
    });
  } catch (error) {
    console.error("getFeed error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: "Invalid post id" });
    }

    const post = await Post.findById(id).populate("user", "username avatar");
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    return res.status(200).json({ success: true, post });
  } catch (error) {
    console.error("getPostById error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: "Invalid post id" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not allowed to delete this post" });
    }

    if (post.imagePublicId) {
      await cloudinary.uploader.destroy(post.imagePublicId);
    }
    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();

    return res.status(200).json({ success: true, message: "Post deleted" });
  } catch (error) {
    console.error("deletePost error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: "Invalid post id" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const userId = req.user.id;
    const alreadyLiked = post.likes.some((u) => u.toString() === userId);

    if (alreadyLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }
    await post.save();

    return res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      likesCount: post.likes.length,
    });
  } catch (error) {
    console.error("toggleLike error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: "Invalid post id" });
    }
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: "Comment text is required" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const comment = await Comment.create({
      post: id,
      user: req.user.id,
      text: text.trim(),
    });
    await comment.populate("user", "username avatar");

    return res.status(201).json({ success: true, comment });
  } catch (error) {
    console.error("addComment error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getComments = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: "Invalid post id" });
    }

    const comments = await Comment.find({ post: id })
      .sort({ createdAt: -1 })
      .populate("user", "username avatar");

    return res.status(200).json({ success: true, count: comments.length, comments });
  } catch (error) {
    console.error("getComments error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    if (!isValidId(commentId)) {
      return res.status(400).json({ success: false, message: "Invalid comment id" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not allowed to delete this comment" });
    }

    await comment.deleteOne();
    return res.status(200).json({ success: true, message: "Comment deleted" });
  } catch (error) {
    console.error("deleteComment error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export {
  createPost,
  getFeed,
  getPostById,
  deletePost,
  toggleLike,
  addComment,
  getComments,
  deleteComment,
};