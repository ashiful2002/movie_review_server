import { prisma } from "../../lib/prisma";

// --- DTOs --- //
export type CreateOrderItemDTO = {
  orderId: string;
  mealId: string;
  quantity: number;
  price: number;
  name: string;
};

export type UpdateOrderItemDTO = {
  quantity?: number;
  price?: number;
  name?: string;
};

// --- Service --- //
const createOrderItem = async (payload: CreateOrderItemDTO) => {
  // 1️⃣ Validate related foreign keys
  const meal = await prisma.meal.findUnique({ where: { id: payload.mealId } });
  if (!meal) throw new Error("Meal not found");

  const order = await prisma.order.findUnique({ where: { id: payload.orderId } });
  if (!order) throw new Error("Order not found");

  // 2️⃣ Create OrderItem
  return await prisma.orderItem.create({
    data: { ...payload },
  });
};

// --- Optional: create multiple order items in transaction ---
const createMultipleOrderItems = async (items: CreateOrderItemDTO[]) => {
  return await prisma.$transaction(
    items.map((item) =>
      prisma.orderItem.create({
        data: item,
      })
    )
  );
};

// --- Get all order items --- //
const getOrderItems = async (orderId?: string) => {
  return await prisma.orderItem.findMany({
    where: orderId ? { orderId } : {},
    include: { meal: true, order: true }, // optional, join info
  });
};

// --- Get single order item --- //
const getSingleOrderItem = async (id: string) => {
  const orderItem = await prisma.orderItem.findUnique({
    where: { id },
    include: { meal: true, order: true },
  });
  if (!orderItem) throw new Error("OrderItem not found");
  return orderItem;
};

// --- Update order item --- //
const updateOrderItem = async (id: string, payload: UpdateOrderItemDTO) => {
  const updated = await prisma.orderItem.update({
    where: { id },
    data: payload,
  });
  return updated;
};

// --- Delete order item --- //
const deleteOrderItem = async (id: string) => {
  return await prisma.orderItem.delete({ where: { id } });
};

export const OrderItemService = {
  createOrderItem,
  createMultipleOrderItems,
  getOrderItems,
  getSingleOrderItem,
  updateOrderItem,
  deleteOrderItem,
};