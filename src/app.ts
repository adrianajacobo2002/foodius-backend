import express from "express";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import cors from "cors";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

import authRoutes from "./routes/auth.routes";
import businessRoutes from "./routes/business.routes";
import foodCategoryRoutes from "./routes/food-category.routes";
import customerRoutes from "./routes/customer.routes"

import foodRoutes from "./routes/food.routes";

import { uploadBusinessImages } from "../src/config/multer";

import scheduleRoutes from "./routes/schedule.routes";


app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/food-categories", foodCategoryRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/foods", foodRoutes); 
app.use("/api/schedules", scheduleRoutes);


app.listen(env.PORT, env.HOST, () => {
  console.log(`Servidor corriendo en http://${env.HOST}:${env.PORT}`);
});

export { app };
