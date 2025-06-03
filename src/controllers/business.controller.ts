import { Request, Response, RequestHandler } from "express";
import { businessService } from "../services/business.service";
import { RegisterBusinessRequestSchema } from "../types/business.request";
import { asyncHandler } from "../utils/asyncHandler"; // ✅ IMPORTACIÓN FALTANTE

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
  }) as RequestHandler,


  //para aprobar o rechazar un negocio

  approve: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await businessService.approveBusiness(id);
    res.json({ success: true, data: result });
  }),

  reject: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await businessService.rejectBusiness(id);
    res.json({ success: true, data: result });
  }),



  //para obtener las solicitudes de negocios pendientes aprobados denegados o todos

getAll: asyncHandler(async (req, res) => {
  const businesses = await businessService.getAllBusinesses();
  res.json({ success: true, data: businesses });
}),

getPending: asyncHandler(async (req, res) => {
  const businesses = await businessService.getBusinessesByStatus("PENDING");
  res.json({ success: true, data: businesses });
}),

getApproved: asyncHandler(async (req, res) => {
  const businesses = await businessService.getBusinessesByStatus("APPROVED");
  res.json({ success: true, data: businesses });
}),

getRejected: asyncHandler(async (req, res) => {
  const businesses = await businessService.getBusinessesByStatus("REJECTED");
  res.json({ success: true, data: businesses });
}),


};



