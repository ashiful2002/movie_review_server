import { Request, Response, NextFunction, RequestHandler } from "express";
import { PaymentsService } from "./payments.service";
import sendResponse from "../../utils/sendResponse";

const checkout: RequestHandler = async (req, res, next) => {
  try {
    const result = await PaymentsService.checkout(req.body, req.user?.id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Checkout session created",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const webhook: RequestHandler = async (req, res, next) => {
  try {
    const result = await PaymentsService.handleWebhook(req.body);

    // Stripe usually requires raw response
    res.status(200).json({
      received: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getPaymentHistory: RequestHandler = async (req, res, next) => {
  try {
    const result = await PaymentsService.getPaymentHistory(req.user?.id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Payment history fetched",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const handlerStripeWebhookEvent = async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.log("missing stripe webhook secret or signature");
    return res
      .status(status.BAD_REQUEST)
      .json({ message: "Missing Stripe signature or secret" });
  }
};
export const PaymentsController = {
  checkout,
  webhook,
  getPaymentHistory,
};