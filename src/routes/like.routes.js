import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  toggleLike,
  getLikeStatus,
  getPostLikes,
} from "../controllers/like.controller.js";

const router = express.Router();

router.post("/:postId", verifyJWT, toggleLike);
router.get("/:postId/count", verifyJWT, getLikeStatus);
router.get("/:postId/users", verifyJWT, getPostLikes);

export default router;