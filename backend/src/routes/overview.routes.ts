import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  getApiLogCount,
  getApiLogCountByTypes,
  getRecentApiLogs,
  countCampers,
} from "../services/db.service";

const router = Router();

router.use(authMiddleware);

// 获取工作台统计数据
router.get("/", async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const timePeriod = (req.query.period as string) || "today";
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [todayCount, weekCount, monthCount, camperCount, apiToday, apiWeek, apiMonth, recentLogs] = await Promise.all([
      getApiLogCount(userId, todayStart),
      getApiLogCount(userId, weekStart),
      getApiLogCount(userId, monthStart),
      countCampers(userId),
      getApiLogCountByTypes(userId, todayStart),
      getApiLogCountByTypes(userId, weekStart),
      getApiLogCountByTypes(userId, monthStart),
      getRecentApiLogs(userId, 20),
    ]);

    const periodMap = { today: apiToday, week: apiWeek, month: apiMonth };
    const apiCounts = periodMap[timePeriod as keyof typeof periodMap] || apiToday;

    res.json({
      stats: {
        today: todayCount,
        week: weekCount,
        month: monthCount,
        camperCount,
        apiCounts,
        timePeriod,
      },
      recentLogs,
    });
  } catch (error) {
    console.error("获取工作台数据失败:", error);
    res.status(500).json({ error: "获取工作台数据失败" });
  }
});

export default router;
