import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth";
import { getRecentApiLogs } from "../services/db.service";

const router = Router();

router.use(authMiddleware);

router.get("/", async (req: Request, res: Response) => {
  try {
    const pageSize = parseInt(req.query.pageSize as string) || 20;

    const logs = await getRecentApiLogs(req.user!.userId, pageSize);

    res.json({
      data: logs,
      total: logs.length,
      page: 1,
      pageSize,
    });
  } catch (error) {
    console.error("获取历史记录失败:", error);
    res.status(500).json({ error: "获取历史记录失败" });
  }
});

export default router;
