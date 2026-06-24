import express from "express";
import auth from "../../middlewares/auth";
  import { StatsController } from "./stats.controller";
import { UserRole } from "../../../generated/prisma";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  StatsController.getStats
);

export const StatsRoutes = router;
