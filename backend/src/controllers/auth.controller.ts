import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";

// REGISTER
export async function register(req: Request, res: Response) {
  try {
    const { name, username, email, password } = req.body;

    // validação básica (evita erro silencioso)
    if (!name || !username || !email || !password) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    const user = await registerUser({
      name,
      username,
      email,
      password,
    });

    return res.status(201).json(user);
  } catch (error: any) {
    return res.status(400).json({
      error: error.message || "Erro ao registrar usuário",
    });
  }
}

// LOGIN
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    const result = await loginUser({ email, password });

    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({
      error: error.message || "Erro ao fazer login",
    });
  }
}