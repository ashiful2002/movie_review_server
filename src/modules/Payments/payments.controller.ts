import { Request, Response, NextFunction, RequestHandler } from "express";
import { PaymentsService } from "./payments.service";
import sendResponse from "../../utils/sendResponse";
import { stripe } from "../../config/stripe.config";
import config from "../../config";

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
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      config.stripe_webhook_secret
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Call your service to handle the event
  await PaymentsService.handleStripeWebhookEvent(event);

  res.status(200).json({ received: true });
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


export const PaymentsController = {
  checkout,
  webhook,
  getPaymentHistory,
};
