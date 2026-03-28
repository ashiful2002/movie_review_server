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

export const PaymentsService = {
  checkout,
  handleWebhook,
  getPaymentHistory,
};