import { Request, Response, RequestHandler } from "express";
import { businessService } from "../services/business.service";
import { RegisterBusinessRequestSchema } from "../types/business.request";
import { asyncHandler } from "../utils/asyncHandler"; // ✅ IMPORTACIÓN FALTANTE
import prisma from "../config/database";
export const businessController = {
  register: (async (req, res) => {
    try {
      const rawData = {
        name: req.body.name,
        email: req.body.email,
        phone_number: req.body.phone_number,
        password: req.body.password,
        location: req.body.location,
        latitude: parseFloat(req.body.latitude),
        longitude: parseFloat(req.body.longitude),
        bank_account_number: "",
        bank_name: "",
        logo: "",
        banner: "",
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

  getProfile: (async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Usuario no autenticado" });
    }

    const business = await prisma.businesses.findFirst({
      where: { user_id: userId },
    });

    if (!business) {
      return res
        .status(404)
        .json({ success: false, message: "Negocio no encontrado" });
    }

    res.json({ success: true, data: business });
  }) as RequestHandler,
};
