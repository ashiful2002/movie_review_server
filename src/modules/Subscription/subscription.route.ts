import { Router } from "express";
import { SubscriptionController } from "./subscription.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

// Public route for the frontend to list plans on the pricing page
router.get("/", SubscriptionController.getSubscriptionPlans);

// Admin-only route to create new Subscription Plans in the database
router.post(
    "/",
    auth(UserRole.ADMIN),
    SubscriptionController.createSubscriptionPlan
);

export const SubscriptionRoutes = router;
