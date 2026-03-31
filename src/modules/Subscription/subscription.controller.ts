import { RequestHandler } from "express";
import { SubscriptionService } from "./subscription.service";
import sendResponse from "../../utils/sendResponse";

const createSubscriptionPlan: RequestHandler = async (req, res, next) => {
    try {
        const result = await SubscriptionService.createSubscriptionPlan(req.body);

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Subscription plan created successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const getSubscriptionPlans: RequestHandler = async (req, res, next) => {
    try {
        const result = await SubscriptionService.getSubscriptionPlans();

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Subscription plans retrieved successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

export const SubscriptionController = {
    createSubscriptionPlan,
    getSubscriptionPlans,
};
