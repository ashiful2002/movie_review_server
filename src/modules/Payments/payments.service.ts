import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { PaymentStatus } from "@prisma/client";

const checkout = async (payload: any, userId: string) => {
  console.log("Service: checkout", payload, userId);

  return {
    sessionId: "sess_123456",
    paymentUrl: "https://fake-payment-gateway.com/checkout/sess_123456",
    amount: payload.amount || 10,
    currency: "USD",
  };
};

const handleWebhook = async (payload: any) => {
  console.log("Service: webhook received", payload);

  return {
    event: payload.type || "payment.success",
    status: "processed",
  };
};

const getPaymentHistory = async (userId: string) => {
  console.log("Service: getPaymentHistory", userId);

  return [
    {
      id: "pay_1",
      amount: 10,
      status: "paid",
      type: "purchase",
      movieId: "1",
    },
    {
      id: "pay_2",
      amount: 5,
      status: "paid",
      type: "rent",
      movieId: "2",
    },
  ];
};

const handlerStripeWebhookEvent = async (event: Stripe.Event) => {
  const existingPayment = await prisma.payment.findFirst({
    where: {
      stripeEventId: event.id,
    },
  });

  if (existingPayment) {
    console.log(`Event ${event.id} already processed. skipping`);
    return { message: `Event ${event.id} already processed. skipping` };
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const appointmentId = session.metadata?.appointmentId;

      const paymentId = session.metadata?.paymentId;

      if (!paymentId || !appointmentId) {
        console.error("Missing paymentId or appointmentId in session metadata");
        return {
          error: "Missing paymentId or appointmentId in session metadata",
        };
      }

      const appointment = await prisma.purchase.findUnique({
        where: {
          id: appointmentId,
        },
      });
      if (!appointment) {
        console.error("Missing paymentId or appointmentId in session metadata");
        return {
          error: "Missing paymentId or appointmentId in session metadata",
        };
      }

      await prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: { id: appointmentId },
          data: {
            // paymentStatus:
            id:
              session.payment_status === "paid"
                ? PaymentStatus.SUCCESS
                : PaymentStatus.PENDING,
          },
        });

        await tx.payment.update({
          where: {
            id: paymentId,
          },
          data: {
            // stripeEventId: event.id,
            id: event.id,
            status:
              session.payment_status === "paid"
                ? PaymentStatus.SUCCESS
                : PaymentStatus.PENDING,
            paymentGetwayData: session as any,
          },
        });
      });
      console.log(
        `payment completed for ${appointmentId} and paymentid ${paymentId}`
      );
      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object;
      console.log(
        `Checkout session ${session.id} expired. Marking associated payment as failed`
      );
      break;
    }
    case "payment_intent.payment_failed": {
      const session = event.data.object;
      console.log(
        `Checkout session ${session.id} expired. Marking associated payment as failed due to expired`
      );
      break;
    }

    default:
      console.log(`unhandled event type ${event.type}`);
  }

  return { message: `Webhook Event ${event.id} processed successfully` };
};

export const PaymentsService = {
  checkout,
  handleWebhook,
  getPaymentHistory,
};
