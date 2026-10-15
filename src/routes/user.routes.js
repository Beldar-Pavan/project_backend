import express from "express";
import { getUsers, registerUser, loginUser } from "../controllers/user.controller.js";
import { getCommentsByPost } from "../controllers/comment.controller.js";

const router = express.Router();

router.get("/getuser", getUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getcommentbypost", getCommentsByPost);

export default router;