import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { authMiddleware } from "../middleware/auth";
import { findUserByEmail, findUserById, createUser } from "../services/db.service";

const router = Router();

// 注册
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: "姓名、邮箱和密码为必填项" });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: "密码至少6位" });
      return;
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      res.status(409).json({ error: "该邮箱已被注册" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser({ name, email, password: hashedPassword });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    res.status(201).json({ token, user });
  } catch (error) {
    console.error("注册失败:", error);
    res.status(500).json({ error: "注册失败，请稍后重试" });
  }
});

// 登录
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "邮箱和密码为必填项" });
      return;
    }

    const user = await findUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: "邮箱或密码错误" });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(401).json({ error: "邮箱或密码错误" });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("登录失败:", error);
    res.status(500).json({ error: "登录失败，请稍后重试" });
  }
});

// 获取当前用户信息
router.get("/me", authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await findUserById(req.user!.userId);

    if (!user) {
      res.status(404).json({ error: "用户不存在" });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error("获取用户信息失败:", error);
    res.status(500).json({ error: "获取用户信息失败" });
  }
});

export default router;
