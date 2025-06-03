import { PrismaClient } from "../../generated/prisma";
const prisma = new PrismaClient();

export const foodCategoryService = {
  create: async (businessId: number, data: { name: string; description: string }) => {
    return await prisma.foodCategories.create({
      data: {
        ...data,
        id_business: businessId,
        is_active: true, // explícito aunque sea por defecto
      },
    });
  },

  getAllActiveByBusiness: async (businessId: number) => {
    return await prisma.foodCategories.findMany({
      where: {
        id_business: businessId,
        is_active: true,
      },
    });
  },

  update: async (id: number, data: { name?: string; description?: string }) => {
    return await prisma.foodCategories.update({
      where: { id },
      data,
    });
  },

  softDelete: async (id: number) => {
    return await prisma.foodCategories.update({
      where: { id },
      data: { is_active: false },
    });
  },
};
