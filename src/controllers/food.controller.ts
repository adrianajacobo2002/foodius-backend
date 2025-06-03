import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import { foodService } from "../services/food.service";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const foodController = {
  // Crear comida con imagen subida (form-data)
  create: asyncHandler(async (req, res) => {
    if (!req.user?.email) {
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
      res.status(403).json({ success: false, message: "Negocio no válido o no aprobado" });
      return;
    }

    const { id_food_category, name, description, price, is_available } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
      res.status(400).json({ success: false, message: "La imagen es requerida" });
      return;
    }

    const img_url = `/uploads/foods/${imageFile.filename}`;

    const created = await foodService.create(Number(id_food_category), {
      name,
      description,
      price: parseFloat(price),
      img_url,
      is_available: is_available === "true",
    });

    res.status(201).json({ success: true, data: created });
  }),

  // Obtener todas las comidas activas por categoría
  getAllByCategory: asyncHandler(async (req, res) => {
    const categoryId = parseInt(req.params.categoryId);
    const foods = await foodService.getAllActiveByCategory(categoryId);
    res.json({ success: true, data: foods });
  }),

  // Editar comida (sin tocar is_active ni is_available)
  update: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, description, price, img_url } = req.body;
    const file = req.file;

    const final_img_url = file ? `/uploads/foods/${file.filename}` : img_url;

    const updated = await foodService.update(id, {
      name,
      description,
      price: parseFloat(price),
      img_url: final_img_url,
    });

    res.json({ success: true, data: updated });
  }),

  // Soft delete (cambiar is_active a false)
  remove: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = await foodService.softDelete(id);
    res.json({ success: true, message: "Comida eliminada", data: deleted });
  }),

  // Cambiar disponibilidad (is_available)
  toggleAvailability: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const { is_available } = req.body;

    const updated = await foodService.toggleAvailability(
      id,
      is_available === true || is_available === "true"
    );

    res.json({ success: true, data: updated });
  }),
};
