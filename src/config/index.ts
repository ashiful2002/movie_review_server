import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT || 5001,
  database_url: process.env.DATABASE_URL,
  jwt_secret: process.env.JWT_SECRET as string,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY as string,
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET as string,
  frontend_url: process.env.FRONTEND_URL || "http://localhost:3000",
};