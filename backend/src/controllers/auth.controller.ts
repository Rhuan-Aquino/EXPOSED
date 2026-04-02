import { Request, Response } from "express";
import { registerUser } from "../services/auth.service";

export async function register(req: Request, res: Response) {
  try {
    const { name, username, email, password } = req.body;

    const user = await registerUser({ name, username, email, password });

    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

import { loginUser } from "../services/auth.service";

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const result = await loginUser({ email, password });

    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}