import { PrismaClient } from "../../generated/prisma";
const prisma = new PrismaClient();

export const foodService = {
  create: async (categoryId: number, data: {
    name: string;
    description: string;
    price: number;
    img_url: string;
    is_available: boolean;
  }) => {
    return await prisma.foods.create({
      data: {
        ...data,
        id_food_category: categoryId,
        is_active: true, // aunque ya es default
      },
    });
  },

  getAllActiveByCategory: async (categoryId: number) => {
    return await prisma.foods.findMany({
      where: {
        id_food_category: categoryId,
        is_active: true,
      },
    });
  },

  update: async (id: number, data: {
    name?: string;
    description?: string;
    price?: number;
    img_url?: string;
  }) => {
    return await prisma.foods.update({
      where: { id },
      data,
    });
  },

  softDelete: async (id: number) => {
    return await prisma.foods.update({
      where: { id },
      data: { is_active: false },
    });
  },

  toggleAvailability: async (id: number, is_available: boolean) => {
    return await prisma.foods.update({
      where: { id },
      data: { is_available },
    });
  }
};
