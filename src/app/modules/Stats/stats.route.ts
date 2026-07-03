import express from "express";
import auth from "../../middlewares/auth";
import { StatsController } from "./stats.controller";
import { UserRole } from "../../../generated/prisma";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.USER, UserRole.SUPER_ADMIN),
  StatsController.getStats
);

export const StatsRoutes = router;
