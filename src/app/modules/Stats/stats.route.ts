import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
 import { StatsController } from "./stats.controller";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  StatsController.getStats
);

export const StatsRoutes = router;
