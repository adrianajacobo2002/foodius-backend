import express from "express";

import { env } from "./config/env";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";
import businessRoutes from "./routes/business.routes";

import foodCategoryRoutes from "./routes/food-category.routes";


const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/food-categories", foodCategoryRoutes);


app.listen(env.PORT, env.HOST, () => {
  console.log(`Servidor corriendo en http://${env.HOST}:${env.PORT}`);
});

export { app };
