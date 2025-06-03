import { Router } from "express";
import { customerController } from "../controllers/customer.controller";
import { authenticate, restrictTo } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { CreateAddressSchema } from "../types/customer.request";
import { UpdateAddressSchema } from "../types/customer.request";


const router = Router();

router.get("/me", authenticate, restrictTo("CLIENT"), customerController.getProfile);
router.get("/addresses", authenticate, restrictTo("CLIENT"), customerController.getAddresses);

router.post("/addresses", authenticate, restrictTo("CLIENT"), validate(CreateAddressSchema), customerController.createAddress);

router.put("/addresses/:id", authenticate, restrictTo("CLIENT"), validate(UpdateAddressSchema), customerController.updateAddress);

router.delete("/addresses/:id", authenticate, restrictTo("CLIENT"), customerController.deleteAddress);
export default router;

