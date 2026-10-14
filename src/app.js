import express from "express";
import user from "./routes/user.routes.js";

const app = express();

app.use(express.json());
app.use("/api/v1/users", user);

export { app };