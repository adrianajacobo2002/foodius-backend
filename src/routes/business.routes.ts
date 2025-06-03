import { Router } from "express";
import { businessController } from "../controllers/business.controller";
import { validate } from "../middlewares/validate.middleware";
import { RegisterBusinessRequestSchema } from "../types/business.request";
import { uploadBusinessImages } from "../config/multer";


import { authenticate, restrictTo } from "../middlewares/auth.middleware";




const router = Router();

router.post(
  "/register",
  businessController.register
);


//rutas para aprobar o rechazar un negocio

router.patch(
  "/approve/:id",
  authenticate,
  restrictTo("ADMIN"),
  businessController.approve
);

router.patch(
  "/reject/:id",
  authenticate,
  restrictTo("ADMIN"),
  businessController.reject
);


// rutas para obtener todas las solicitudes de negocios o por estado

router.get(
  "/all",
  authenticate,
  restrictTo("ADMIN"),
  businessController.getAll
);

router.get(
  "/pending",
  authenticate,
  restrictTo("ADMIN"),
  businessController.getPending
);

router.get(
  "/approved",
  authenticate,
  restrictTo("ADMIN"),
  businessController.getApproved
);

router.get(
  "/rejected",
  authenticate,
  restrictTo("ADMIN"),
  businessController.getRejected
);


export default router;
