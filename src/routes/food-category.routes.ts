import { Router } from "express";
import { foodCategoryController } from "../controllers/food-category.controller";
import { authenticate, restrictTo } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticate, restrictTo("BUSINESS"));

router.post("/", foodCategoryController.create);
router.get("/", foodCategoryController.getAll);
router.put("/:id", foodCategoryController.update);
router.delete("/:id", foodCategoryController.remove);

export default router;
