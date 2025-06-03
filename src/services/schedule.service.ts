import { PrismaClient, WEEKDAYS } from "../../generated/prisma";

const prisma = new PrismaClient();

export const scheduleService = {
  // Crear un horario
  async create(businessId: number, data: { day: WEEKDAYS, from: Date, to: Date }) {
    const existing = await prisma.schedules.findFirst({
      where: { id_business: businessId, day: data.day },
    });

    if (existing) {
      throw new Error(`Ya existe un horario para el día ${data.day}`);
    }

    const total = await prisma.schedules.count({ where: { id_business: businessId } });

    if (total >= 7) {
      throw new Error("Ya tienes los 7 días registrados");
    }

    return await prisma.schedules.create({
      data: {
        ...data,
        id_business: businessId,
        is_open: true, // por defecto
      },
    });
  },

  // Obtener todos los horarios del negocio
  async getAllByBusiness(businessId: number) {
    return await prisma.schedules.findMany({
      where: { id_business: businessId },
      orderBy: { day: "asc" },
    });
  },

  // Editar horario
  async update(id: number, data: { from: Date, to: Date }) {
    return await prisma.schedules.update({
      where: { id },
      data,
    });
  },

  // Eliminar horario
  async remove(id: number) {
    return await prisma.schedules.delete({ where: { id } });
  },

  // Cambiar el estado de is_open
  async toggleOpen(id: number, isOpen: boolean) {
    return await prisma.schedules.update({
      where: { id },
      data: { is_open: isOpen },
    });
  },
};
