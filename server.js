import express from "express";
import cors from "cors";

const app = express();
app.use(cors({ origin: "http://localhost:8080" }));
app.use(express.json());

let users = [{ id: 1, name: "Asha" }];

app.get("/api/users", (req, res) => {
  res.json(users);
});

app.post("/api/users", (req, res) => {
  const user = { id: Date.now(), name: req.body.name };
  users.push(user);
  res.status(201).json(user);
});

app.listen(8080, () => console.log("Server on http://localhost:8080"));