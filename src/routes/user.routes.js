import express from "express";
import { getUsers, registerUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/getuser", getUsers);
router.post("/register", registerUser);

export default router;