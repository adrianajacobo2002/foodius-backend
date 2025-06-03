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
