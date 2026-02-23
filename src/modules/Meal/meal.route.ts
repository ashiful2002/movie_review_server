import express from "express";
import { MealController } from "./meal.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/", auth(UserRole.PROVIDER), MealController.createMeal);
router.get("/", auth(UserRole.PROVIDER), MealController.getMeals);
router.get("/:id", MealController.getSingleMeal);

export const MealRoutes = router;
