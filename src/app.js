import express from "express";
import user from "./routes/user.routes.js";
import commentRouter from "./routes/comment.routes.js";
import like from "./routes/like.routes.js";
import instagramRoutes from "./routes/instagram.routes.js";

const app = express();

app.use(express.json());
app.use("/api/v1/users", user);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", like);
app.use("/api/v1", instagramRoutes);
app.use("/api/v1/instagram", instagramRoutes);
app.use("/instagram", instagramRoutes)

export { app };