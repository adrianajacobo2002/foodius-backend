import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import { scheduleService } from "../services/schedule.service";
import { WEEKDAYS } from "../../generated/prisma";

export const scheduleController = {
  // Crear horario
  create: asyncHandler((async (req, res) => {
    const businessId = req.user?.id;
    if (!businessId) {
      return res.status(401).json({ success: false, message: "No autenticado" });
    }

    const { day, from, to } = req.body;

    if (!Object.values(WEEKDAYS).includes(day)) {
      return res.status(400).json({ success: false, message: "Día inválido" });
    }

    const created = await scheduleService.create(businessId, {
      day,
      from: new Date(from),
      to: new Date(to),
    });

    res.status(201).json({ success: true, data: created });
  }) as RequestHandler),

  // Obtener todos los horarios del negocio autenticado
  getAll: asyncHandler((async (req, res) => {
    const businessId = req.user?.id;
    if (!businessId) {
      return res.status(401).json({ success: false, message: "No autenticado" });
    }

    const horarios = await scheduleService.getAllByBusiness(businessId);
    res.json({ success: true, data: horarios });
  }) as RequestHandler),

  // Editar horario
  update: asyncHandler((async (req, res) => {
    const id = parseInt(req.params.id);
    const { from, to } = req.body;

    const updated = await scheduleService.update(id, {
      from: new Date(from),
      to: new Date(to),
    });

    res.json({ success: true, data: updated });
  }) as RequestHandler),

  // Eliminar horario
  remove: asyncHandler((async (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = await scheduleService.remove(id);
    res.json({ success: true, message: "Horario eliminado", data: deleted });
  }) as RequestHandler),

  // Cambiar estado de is_open
  toggleOpen: asyncHandler((async (req, res) => {
    const id = parseInt(req.params.id);
    const { is_open } = req.body;

    const updated = await scheduleService.toggleOpen(id, Boolean(is_open));
    res.json({ success: true, data: updated });
  }) as RequestHandler),
};
