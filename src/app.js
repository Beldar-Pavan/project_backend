import express from "express";
import user from "./routes/user.routes.js";
import commentRouter from "./routes/comment.routes.js";

const app = express();

app.use(express.json());
app.use("/api/v1/users", user);
app.use("/api/v1/comments", commentRouter);

export { app };