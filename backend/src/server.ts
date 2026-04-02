import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import { authMiddleware } from "./middlewares/auth.middleware";
import { getProfile } from "./controllers/user.controller";
import userRoutes from "./routes/user.routes";
import postRoutes from "./routes/posts.router";
import "dotenv/config";


const app = express();
app.use(express.json());
app.use(cors());



app.get("/", (req, res) => {
  res.send("API rodando 🚀");
});

app.use("/auth", authRoutes); // 👈 ESSA LINHA RESOLVE TUDO

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("🔥 SERVER SUBIU");
  console.log(`Server running on port ${PORT}`);
});


app.get("/profile", authMiddleware, (req, res) => {
  return getProfile(req as any, res);
});

app.use("/user", userRoutes);
app.use("/posts", postRoutes);

