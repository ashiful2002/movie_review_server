 import { prisma } from "../../lib/prisma";

const createSubscriptionPlan = async (payload: any) => {
    const result = await prisma.subscriptionPlan.create({
        data: payload,
    });
    return result;
};

const getSubscriptionPlans = async () => {
    const result = await prisma.subscriptionPlan.findMany({
        where: { isActive: true },
        orderBy: { price: 'asc' }
    });
    return result;
};

export const SubscriptionService = {
    createSubscriptionPlan,
    getSubscriptionPlans,
};
