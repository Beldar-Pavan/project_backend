import express from "express";
import { getUsers, createUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/getuser", getUsers);
router.post("/create-user", createUser);

export default router;