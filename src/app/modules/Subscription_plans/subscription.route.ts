import { Router } from "express";
import { SubscriptionController } from "./subscription.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";

const router = Router();

router.get("/", SubscriptionController.getSubscriptionPlans);
router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  SubscriptionController.createSubscriptionPlan
);

export const SubscriptionRoutes = router;
