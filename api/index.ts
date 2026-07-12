import { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../backend/src/index";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Vercel strips the /api prefix, but Express expects it
  // Reconstruct the URL with /api prefix
  const url = req.url || "/";
  req.url = "/api" + (url.startsWith("/") ? url : "/" + url);
  return app(req as any, res as any);
}
