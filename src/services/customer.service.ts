import prisma from "../config/database";
import { Prisma } from "../../generated/prisma";
import {
  CreateAddressRequest,
  UpdateAddressRequest,
  CreateOrderRequest,
} from "../types/customer.request";
import { ORDER_STATES } from "../../generated/prisma";

export const customerService = {
  async getCustomerProfile(id: number) {
    const user = await prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        first_name: true,
        last_names: true,
        email: true,
        phone_number: true,
        created_at: true,
      },
    });

    if (!user) {
      throw new Error("Cliente no encontrado");
    }

    return user;
  },

  async createAddress(userId: number, data: CreateAddressRequest) {
    if (data.is_default) {
      await prisma.userAddresses.updateMany({
        where: { userId },
        data: { is_default: false },
      });
    }

    const address = await prisma.userAddresses.create({
      data: {
        userId,
        label: data.label || "Otra",
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        reference_point: data.reference_point,
        is_default: data.is_default ?? false,
      },
    });

    return address;
  },

  async getCustomerAddresses(userId: number) {
    return await prisma.userAddresses.findMany({
      where: { userId },
      orderBy: { is_default: "desc" },
    });
  },

  async updateAddress(
    userId: number,
    addressId: number,
    data: UpdateAddressRequest
  ) {
    const existing = await prisma.userAddresses.findFirst({
      where: { id: addressId, userId, is_active: true },
    });

    if (!existing) throw new Error("Dirección no encontrada o inactiva");

    if (data.is_default) {
      await prisma.userAddresses.updateMany({
        where: { userId },
        data: { is_default: false },
      });
    }

    const updated = await prisma.userAddresses.update({
      where: { id: addressId },
      data: {
        ...data,
        is_default: data.is_default ?? existing.is_default,
      },
    });

    return updated;
  },

  async softDeleteAddress(userId: number, addressId: number) {
    const existing = await prisma.userAddresses.findFirst({
      where: { id: addressId, userId, is_active: true },
    });

    if (!existing) throw new Error("Dirección no encontrada o ya desactivada");

    await prisma.userAddresses.update({
      where: { id: addressId },
      data: { is_active: false, is_default: false },
    });
  },

  async createOrder(userId: number, data: CreateOrderRequest) {
    const address = await prisma.userAddresses.findFirst({
      where: { id: data.address_id, userId, is_active: true },
    });

    if (!address) throw new Error("Dirección no válida.");

    const foods = await prisma.foods.findMany({
      where: {
        id: { in: data.items.map((i) => i.food_id) },
        is_available: true,
        is_active: true,
      },
    });

    if (foods.length !== data.items.length) {
      throw new Error("Uno o más platillos no están disponibles.");
    }

    const items = data.items.map((item) => {
      const food = foods.find((f) => f.id === item.food_id)!;
      const subtotal = food.price.mul(item.quantity);
      return {
        id_food: food.id,
        quantity: item.quantity,
        price: food.price,
        subtotal,
      };
    });

    const subtotal = items.reduce(
      (acc, item) => acc.plus(item.subtotal),
      new Prisma.Decimal(0)
    );
    const serviceFee = subtotal.mul(0.05);

    const order = await prisma.orders.create({
      data: {
        id_user: userId,
        delivery_address: address.location,
        latitude: address.latitude,
        longitude: address.longitude,
        reference_point: address.reference_point,
        state: "ACTIVE",
        service_fee: serviceFee,
        delivery_method: data.delivery_method,
        payment_method: data.payment_method,
        OrdersDetails: {
          create: items.map((item) => ({
            id_food: item.id_food,
            quantity: item.quantity,
            price: item.subtotal,
          })),
        },
      },
      include: { OrdersDetails: true },
    });

    return order;
  },

  async getCustomerOrders(userId: number, state?: ORDER_STATES) {
    const orders = await prisma.orders.findMany({
      where: {
        id_user: userId,
        ...(state && { state }),
      },
      include: {
        OrdersDetails: {
          include: {
            Food: {
              select: {
                name: true,
                img_url: true,
                price: true,
              },
            },
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    return orders.map((order) => {
      const subtotal = order.OrdersDetails.reduce(
        (acc, item) => acc + Number(item.price),
        0
      );
      const total = subtotal + Number(order.service_fee);

      return {
        ...order,
        subtotal: subtotal.toFixed(2),
        total: total.toFixed(2),
      };
    });
  },

  async getOrderById(userId: number, orderId: number) {
    const order = await prisma.orders.findFirst({
      where: {
        id: orderId,
        id_user: userId,
      },
      include: {
        OrdersDetails: {
          include: {
            Food: {
              select: {
                name: true,
                img_url: true,
                price: true,
              },
            },
          },
        },
      },
    });

    if (!order) return null;

    const subtotal = order.OrdersDetails.reduce(
      (acc, item) => acc + Number(item.price),
      0
    );
    const total = subtotal + Number(order.service_fee);

    return {
      id: order.id,
      state: order.state,
      delivery_address: order.delivery_address,
      reference_point: order.reference_point,
      delivery_method: order.delivery_method,
      payment_method: order.payment_method,
      created_at: order.created_at,
      subtotal: subtotal.toFixed(2),
      service_fee: Number(order.service_fee).toFixed(2),
      total: total.toFixed(2),
      items: order.OrdersDetails.map((detail) => ({
        name: detail.Food.name,
        img_url: detail.Food.img_url,
        unit_price: Number(detail.Food.price).toFixed(2),
        quantity: detail.quantity,
        total: Number(detail.price).toFixed(2),
      })),
    };
  },
};
