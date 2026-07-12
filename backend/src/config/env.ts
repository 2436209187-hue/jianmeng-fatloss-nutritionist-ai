import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", "..", ".env") });

export const env = {
  PORT: parseInt(process.env.PORT || "3000", 10),
  DATABASE_URL: process.env.DATABASE_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "default-secret-change-in-production",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY || "",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
  NODE_ENV: process.env.NODE_ENV || "development",
  FASTGPT_API_URL: process.env.FASTGPT_API_URL || "",
  FASTGPT_API_KEY: process.env.FASTGPT_API_KEY || "",
  FASTGPT_APP_ID: process.env.FASTGPT_APP_ID || "",
  FASTGPT_DIET_APP_ID: process.env.FASTGPT_DIET_APP_ID || "",
  FASTGPT_INGREDIENT_APP_ID: process.env.FASTGPT_INGREDIENT_APP_ID || "",
  FASTGPT_MENU_APP_ID: process.env.FASTGPT_MENU_APP_ID || "",
};
