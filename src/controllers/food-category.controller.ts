import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import { foodCategoryService } from "../services/food-category.service";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const foodCategoryController = {
  // Crear categoría de comida
  create: asyncHandler(async (req, res) => {
    if (!req.user || typeof req.user.email !== "string") {
      res.status(401).json({ success: false, message: "Usuario no autenticado" });
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
      res.status(404).json({ success: false, message: "Negocio no encontrado o no aprobado" });
      return;
    }

    const { name, description } = req.body;
    const category = await foodCategoryService.create(business.id, { name, description });
    res.status(201).json({ success: true, data: category });
  }) as RequestHandler,

  // Obtener categorías activas del negocio autenticado
  getAll: asyncHandler(async (req, res) => {
    if (!req.user || typeof req.user.email !== "string") {
      res.status(401).json({ success: false, message: "Usuario no autenticado" });
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
      res.status(404).json({ success: false, message: "Negocio no encontrado o no aprobado" });
      return;
    }

    const categories = await foodCategoryService.getAllActiveByBusiness(business.id);
    res.json({ success: true, data: categories });
  }) as RequestHandler,

  // Editar una categoría
  update: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, description } = req.body;

    const updated = await foodCategoryService.update(id, { name, description });
    res.json({ success: true, data: updated });
  }) as RequestHandler,

  // Eliminar lógicamente una categoría
  remove: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = await foodCategoryService.softDelete(id);
    res.json({ success: true, message: "Categoría eliminada", data: deleted });
  }) as RequestHandler,
};
