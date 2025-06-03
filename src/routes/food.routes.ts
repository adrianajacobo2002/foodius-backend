import { Router } from "express";
import { foodController } from "../controllers/food.controller";
import { authenticate, restrictTo } from "../middlewares/auth.middleware";
import { uploadFoodImage } from "../config/multer.food"; // ✅ nuevo import

const router = Router();

// Crear comida (requiere imagen)
router.post(
  "/",
  authenticate,
  restrictTo("BUSINESS"),
  uploadFoodImage.single("foodImage"), // 👈 aquí usamos "foodImage"
  foodController.create
);

// Obtener todas las comidas activas por categoría
router.get(
  "/category/:categoryId",
  authenticate,
  restrictTo("BUSINESS"),
  foodController.getAllByCategory
);

// Editar comida (imagen opcional)
router.patch(
  "/:id",
  authenticate,
  restrictTo("BUSINESS"),
  uploadFoodImage.single("foodImage"), // 👈 aquí usamos "foodImage"
  foodController.update
);

// Eliminar (soft delete)
router.delete(
  "/:id",
  authenticate,
  restrictTo("BUSINESS"),
  foodController.remove
);

// Cambiar disponibilidad
router.patch(
  "/:id/availability",
  authenticate,
  restrictTo("BUSINESS"),
  foodController.toggleAvailability
);

export default router;
