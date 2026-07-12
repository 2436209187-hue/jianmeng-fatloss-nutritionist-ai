// This file is processed by esbuild during Vercel build (build.sh)
// esbuild bundles all imports into a single api/index.js
import app from "../backend/src/index";

export default (req: any, res: any) => {
  try {
    return app(req, res);
  } catch (err: any) {
    res.status(500).json({ error: "Runtime Error", message: err.message });
  }
};
