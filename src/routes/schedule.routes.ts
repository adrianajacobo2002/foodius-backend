import { Router } from "express";
import { scheduleController } from "../controllers/schedule.controller";
import { authenticate, restrictTo } from "../middlewares/auth.middleware";

const router = Router();

// Solo negocios autenticados pueden acceder
router.use(authenticate, restrictTo("BUSINESS"));

// Crear un nuevo horario
router.post("/", scheduleController.create);

// Obtener todos los horarios del negocio
router.get("/", scheduleController.getAll);

// Editar un horario por ID
router.patch("/:id", scheduleController.update);

// Eliminar un horario por ID
router.delete("/:id", scheduleController.remove);

// Cambiar el estado is_open (activar/desactivar horario)
router.patch("/:id/toggle", scheduleController.toggleOpen);

export default router;
