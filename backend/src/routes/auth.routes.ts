import { Router } from "express";
import { register } from "../controllers/auth.controller"; // 👈 IMPORT CORRETO

const router = Router();

// TESTE
router.get("/test", (req, res) => {
  res.send("rota funcionandoooooooooooooooooooooooooo");
});

// REGISTRO
router.post("/register", register);

import { login } from "../controllers/auth.controller";

router.post("/login", login);

export default router;