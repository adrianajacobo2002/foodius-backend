import { Router } from "express";
import { businessController } from "../controllers/business.controller";
import { validate } from "../middlewares/validate.middleware";
import { RegisterBusinessRequestSchema } from "../types/business.request";
import { uploadBusinessImages } from "../config/multer";

const router = Router();

router.post(
  "/register",
  uploadBusinessImages.fields([{ name: "logo" }, { name: "banner" }]),
  businessController.register
);


export default router;
