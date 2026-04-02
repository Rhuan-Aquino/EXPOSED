import { Router } from "express";
import { getProfile } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getUserByUsername } from "../controllers/user.controller";
import { updateProfile } from "../controllers/user.controller";
import { createPost } from "../controllers/post.controller";
import { getUserProfile } from "../controllers/user.controller";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

router.get("/profile", authMiddleware, getProfile);
router.get("/:username", getUserByUsername);
router.put("/profile", authMiddleware, updateProfile);
router.post("/", authMiddleware, createPost);
router.get("/:username", getUserProfile);
router.put("/me", authMiddleware, upload.single("avatar"), updateProfile);


export default router;