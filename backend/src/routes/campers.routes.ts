import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  getCampers,
  createCamper,
  updateCamper,
  deleteCamper,
} from "../services/db.service";

const router = Router();

router.use(authMiddleware);

router.get("/", async (req: Request, res: Response) => {
  try {
    const campers = await getCampers(req.user!.userId);
    res.json(campers);
  } catch (error) {
    console.error("获取营员列表失败:", error);
    res.status(500).json({ error: "获取营员列表失败" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, ...rest } = req.body;
    if (!name) {
      res.status(400).json({ error: "营员姓名为必填项" });
      return;
    }
    const camper = await createCamper(req.user!.userId, { name, ...rest });
    res.status(201).json(camper);
  } catch (error) {
    console.error("创建营员失败:", error);
    res.status(500).json({ error: "创建营员失败" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const camper = await updateCamper(req.params.id, req.user!.userId, req.body);
    if (!camper) {
      res.status(404).json({ error: "营员不存在" });
      return;
    }
    res.json(camper);
  } catch (error: any) {
    if (error?.code === "PGRST116") {
      res.status(404).json({ error: "营员不存在" });
      return;
    }
    console.error("更新营员失败:", error);
    res.status(500).json({ error: "更新营员失败" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await deleteCamper(req.params.id, req.user!.userId);
    res.json({ success: true });
  } catch (error) {
    console.error("删除营员失败:", error);
    res.status(500).json({ error: "删除营员失败" });
  }
});

export default router;
