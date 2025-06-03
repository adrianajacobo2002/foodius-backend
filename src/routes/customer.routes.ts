import { Router } from "express";
import { customerController } from "../controllers/customer.controller";
import { authenticate, restrictTo } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { CreateAddressSchema } from "../types/customer.request";


const router = Router();

router.get("/me", authenticate, restrictTo("CLIENT"), customerController.getProfile);
router.post("/addresses", authenticate, restrictTo("CLIENT"), validate(CreateAddressSchema), customerController.createAddress);

// En customer.routes.ts (para prueba):
router.post("/debug", (req, res) => {
  console.log("BODY DEBUG:", req.body);
  res.json({ received: req.body });
});

export default router;
