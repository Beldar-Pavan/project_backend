import { Router } from "express";
import {
  createPost,
  getFeed,
  getPostById,
  deletePost,
  toggleLike,
  addComment,
  getComments,
  deleteComment,
} from "../controllers/instagram.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/posts").post(upload.single("image"), createPost).get(getFeed);
router.route("/posts/:id").get(getPostById).delete(deletePost);

router.route("/posts/:id/like").put(toggleLike);

router.route("/posts/:id/comments").post(addComment).get(getComments);
router.route("/comments/:commentId").delete(deleteComment);

export default router;
