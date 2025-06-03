import prisma from "../config/database";
import {
  CreateAddressRequest,
  UpdateAddressRequest,
} from "../types/customer.request";

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
};
