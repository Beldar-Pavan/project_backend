import { Router } from "express";
import {
  createComment,
  getCommentsByPost,
  updateComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/:postId", getCommentsByPost);
router.post("/:postId", verifyJWT, createComment);
router.put("/:commentId", verifyJWT, updateComment);

export default router;
