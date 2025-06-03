import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import { foodCategoryService } from "../services/food-category.service";


export const foodCategoryController = {
  create: asyncHandler((async (req, res) => {
    if (!req.user || typeof req.user.id !== "number") {
      res.status(401).json({ success: false, message: "Usuario no autenticado" });
      return;
    }

    const businessId = req.user.id;
    const { name, description } = req.body;

    const category = await foodCategoryService.create(businessId, { name, description });
    res.status(201).json({ success: true, data: category });
  }) as RequestHandler),

  getAll: asyncHandler((async (req, res) => {
    if (!req.user || typeof req.user.id !== "number") {
      res.status(401).json({ success: false, message: "Usuario no autenticado" });
      return;
    }

    const businessId = req.user.id;
    const categories = await foodCategoryService.getAllActiveByBusiness(businessId);
    res.json({ success: true, data: categories });
  }) as RequestHandler),

  update: asyncHandler((async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, description } = req.body;

    const updated = await foodCategoryService.update(id, { name, description });
    res.json({ success: true, data: updated });
  }) as RequestHandler),

  remove: asyncHandler((async (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = await foodCategoryService.softDelete(id);
    res.json({ success: true, message: "Categoría eliminada", data: deleted });
  }) as RequestHandler),
};
