import { Router } from "express";
import { customerController } from "../controllers/customer.controller";
import { authenticate, restrictTo } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  CreateAddressSchema,
  UpdateAddressSchema,
  CreateOrderSchema,
} from "../types/customer.request";

const router = Router();

router.get(
  "/me",
  authenticate,
  restrictTo("CLIENT"),
  customerController.getProfile
);
router.get(
  "/addresses",
  authenticate,
  restrictTo("CLIENT"),
  customerController.getAddresses
);

router.get(
  "/orders",
  authenticate,
  restrictTo("CLIENT"),
  customerController.getOrders
);

router.get(
  "/orders/:id",
  authenticate,
  restrictTo("CLIENT"),
  customerController.getOrderById
);

router.post(
  "/addresses",
  authenticate,
  restrictTo("CLIENT"),
  validate(CreateAddressSchema),
  customerController.createAddress
);
router.post(
  "/orders",
  authenticate,
  restrictTo("CLIENT"),
  validate(CreateOrderSchema),
  customerController.createOrder
);
router.put(
  "/addresses/:id",
  authenticate,
  restrictTo("CLIENT"),
  validate(UpdateAddressSchema),
  customerController.updateAddress
);

router.delete(
  "/addresses/:id",
  authenticate,
  restrictTo("CLIENT"),
  customerController.deleteAddress
);
export default router;
