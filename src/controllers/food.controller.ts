import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import { foodService } from "../services/food.service";

export const foodController = {
  // Crear comida con imagen subida (form-data)
  create: asyncHandler((async (req, res) => {
    const { id_food_category, name, description, price, is_available } = req.body;

    const imageFile = req.file;
    if (!imageFile) {
      return res.status(400).json({ success: false, message: "La imagen es requerida" });
    }

    const img_url = `/uploads/foods/${imageFile.filename}`;

    const created = await foodService.create(Number(id_food_category), {
      name,
      description,
      price: parseFloat(price),
      img_url,
      is_available: is_available === "true"
    });

    res.status(201).json({ success: true, data: created });
  }) as RequestHandler),

  // Obtener todas las comidas activas por categoría
  getAllByCategory: asyncHandler((async (req, res) => {
    const categoryId = parseInt(req.params.categoryId);
    const foods = await foodService.getAllActiveByCategory(categoryId);
    res.json({ success: true, data: foods });
  }) as RequestHandler),

  // Editar comida (sin tocar is_active ni is_available)
  update: asyncHandler((async (req, res) => {
    const id = parseInt(req.params.id);
    const file = req.file;
    const img_url = file ? `/uploads/foods/${file.filename}` : req.body.img_url;

    const { name, description, price } = req.body;

    const updated = await foodService.update(id, {
      name,
      description,
      price: Number(price),
      img_url,
    });

    res.json({ success: true, data: updated });
  }) as RequestHandler),

  // Soft delete (cambiar is_active a false)
  remove: asyncHandler((async (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = await foodService.softDelete(id);
    res.json({ success: true, message: "Comida eliminada", data: deleted });
  }) as RequestHandler),

  // Cambiar disponibilidad (is_available)
  toggleAvailability: asyncHandler((async (req, res) => {
  const id = parseInt(req.params.id);
  const { is_available } = req.body;

  const updated = await foodService.toggleAvailability(
    id,
    is_available === true || is_available === "true"
  );

  res.json({ success: true, data: updated });
}) as RequestHandler),

};
