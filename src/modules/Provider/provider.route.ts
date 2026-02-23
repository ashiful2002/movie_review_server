import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { ProviderController } from "./provider.controller";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.PROVIDER),
  ProviderController.createProviderProfile
);

router.get(
  "/me",
  auth(UserRole.PROVIDER),
  ProviderController.getMyProviderProfile
);

router.get("/:id", ProviderController.getSingleProviderProfile);

export const ProviderRoutes = router;
