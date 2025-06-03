import { Request, Response, RequestHandler } from "express";
import { businessService } from "../services/business.service";
import { RegisterBusinessRequestSchema } from "../types/business.request";

export const businessController = {
  register: (async (req, res) => {
    try {
      const files = req.files as Record<string, Express.Multer.File[]>;
      const logo = files["logo"]?.[0]?.filename || "";
      const banner = files["banner"]?.[0]?.filename || "";

      const rawData = {
        name: req.body.name,
        email: req.body.email,
        phone_number: req.body.phone_number,
        password: req.body.password,
        location: req.body.location,
        latitude: parseFloat(req.body.latitude),
        longitude: parseFloat(req.body.longitude),
        bank_account_number: req.body.bank_account_number || "",
        bank_name: req.body.bank_name || "",
        logo: `/uploads/businesses/logos/${logo}`,
        banner: `/uploads/businesses/banners/${banner}`,
      };

      const validatedData = RegisterBusinessRequestSchema.parse(rawData);

      const business = await businessService.registerBusiness(validatedData);

      res.status(201).json({
        success: true,
        message: "Negocio registrado correctamente. Esperando aprobación.",
        data: business,
      });
    } catch (error: any) {
      console.error("Error en registro de negocio:", error);
      if (error?.errors) {
        return res.status(400).json({
          success: false,
          message: "Validación fallida",
          errors: error.errors,
        });
      }
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }) as RequestHandler, // 👈 Esto soluciona el error
};