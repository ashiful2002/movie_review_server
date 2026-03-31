import { stripe } from "../../config/stripe.config";
import { prisma } from "../../lib/prisma";
import { PaymentStatus } from "@prisma/client";
import config from "../../config";

const checkout = async (payload: any, userId: string) => {
  let dbAmount = payload.amount || 10;
  let productName = payload.productName || "Purchase";
  let metadata: any = { userId };

  // Fetch true price from DB if planId is provided
  if (payload.planId) {
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: payload.planId },
    });
    if (!plan) throw new Error("Subscription plan not found");
    dbAmount = plan.price;
    productName = plan.name;
    metadata.planId = plan.id;
  } else if (payload.movieId) {
    const movie = await prisma.movie.findUnique({
      where: { id: payload.movieId },
    });
    if (!movie) throw new Error("Movie not found");
    dbAmount = movie.price > 0 ? movie.price : dbAmount;
    productName = movie.title;
    metadata.movieId = movie.id;
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: productName,
          },
          unit_amount: Math.round(dbAmount * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${config.frontend_url}/success`,
    cancel_url: `${config.frontend_url}/cancel`,
    metadata,
  });

  await prisma.payment.create({
    data: {
      id: session.id,
      amount: dbAmount,
      status: PaymentStatus.PENDING,
      provider: "stripe",
      userId,
      transactionId: (session.payment_intent as string) || null,
    },
  });

  return {
    sessionId: session.id,
    paymentUrl: session.url,
    amount: dbAmount,
    currency: "USD",
  };
};

const handleStripeWebhookEvent = async (event: any) => {
  if (event.type === "checkout.session.completed") {
    // Check idempotency first before processing
    const existingPayment = await prisma.payment.findFirst({
      where: { stripeEventId: event.id },
    });

    if (existingPayment) {
      return { message: "Webhook already processed" };
    }

    const session = event.data.object;
    const metadata = session.metadata;

    await prisma.$transaction(async (tx) => {
      // 1. Update the Payment
      const payment = await tx.payment.update({
        where: { id: session.id },
        data: {
          status: PaymentStatus.SUCCESS,
          transactionId: (session.payment_intent as string) || null,
          stripeEventId: event.id,
        },
      });

      // 2. Fulfill Subscription if planId exists
      if (metadata && metadata.planId) {
        const plan = await tx.subscriptionPlan.findUnique({
          where: { id: metadata.planId },
        });

        if (plan) {
          const startDate = new Date();
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + plan.duration);

          const subscription = await tx.subscription.create({
            data: {
              userId: metadata.userId,
              planId: plan.id,
              startDate,
              expiresAt,
            },
          });

          // Link the payment to the created subscription
          await tx.payment.update({
            where: { id: payment.id },
            data: { subscriptionId: subscription.id },
          });
        }
      }
    });
  }

  return { message: `Webhook Event ${event.id} processed successfully` };
};

const getPaymentHistory = async (userId: string) => {
  return prisma.payment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      subscription: {
        include: {
          plan: true,
        },
      },
    },
  });
};

export const PaymentsService = {
  checkout,
  handleStripeWebhookEvent,
  getPaymentHistory,
};