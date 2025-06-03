import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { scheduleService } from "../services/schedule.service";
import { PrismaClient, WEEKDAYS } from "../../generated/prisma";

const prisma = new PrismaClient();

export const scheduleController = {
  // Crear horario
  create: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.email) {
      res.status(401).json({ success: false, message: "No autenticado" });
      return;
    }

    const business = await prisma.businesses.findFirst({
      where: {
        email: req.user.email,
        is_active: true,
        approval_status: "APPROVED",
      },
    });

    if (!business) {
      res.status(404).json({ success: false, message: "Negocio no válido o no aprobado" });
      return;
    }

    const { day, from, to } = req.body;

    if (!Object.values(WEEKDAYS).includes(day)) {
      res.status(400).json({ success: false, message: "Día inválido" });
      return;
    }

    const created = await scheduleService.create(business.id, {
      day,
      from: new Date(from),
      to: new Date(to),
    });

    res.status(201).json({ success: true, data: created });
  }),

  // Obtener todos los horarios del negocio autenticado
  getAll: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.email) {
      res.status(401).json({ success: false, message: "No autenticado" });
      return;
    }

    const business = await prisma.businesses.findFirst({
      where: {
        email: req.user.email,
        is_active: true,
        approval_status: "APPROVED",
      },
    });

    if (!business) {
      res.status(404).json({ success: false, message: "Negocio no válido o no aprobado" });
      return;
    }

    const horarios = await scheduleService.getAllByBusiness(business.id);
    res.json({ success: true, data: horarios });
  }),

  // Editar horario
  update: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { from, to } = req.body;

    const updated = await scheduleService.update(id, {
      from: new Date(from),
      to: new Date(to),
    });

    res.json({ success: true, data: updated });
  }),

  // Eliminar horario
  remove: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const deleted = await scheduleService.remove(id);
    res.json({ success: true, message: "Horario eliminado", data: deleted });
  }),

  // Cambiar estado de is_open
  toggleOpen: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { is_open } = req.body;

    const updated = await scheduleService.toggleOpen(id, Boolean(is_open));
    res.json({ success: true, data: updated });
  }),
};
