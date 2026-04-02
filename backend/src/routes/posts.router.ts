import { Router } from "express";
import { createPost } from "../controllers/post.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getPosts } from "../controllers/post.controller";
import { upload } from "../middlewares/upload.middleware";
import { deletePost } from "../controllers/post.controller";

const router = Router();
router.get("/", getPosts);
router.post("/", authMiddleware, upload.single("image"), createPost);
router.delete("/:postId", authMiddleware, deletePost);


export default router;