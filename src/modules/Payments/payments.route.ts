import express from "express";
import { PaymentsController } from "./payments.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/checkout", auth(UserRole.USER), PaymentsController.checkout);
router.post("/webhook",  PaymentsController.webhook);
router.get("/history", PaymentsController.getPaymentHistory);

export const PaymentsRoutes = router;
