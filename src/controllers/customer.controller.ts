import { RequestHandler } from "express";
import { customerService } from "../services/customer.service";

export const customerController = {
  getProfile: (async (req, res) => {
    try {
      const customerId = req.user?.id;

      if (!customerId) {
        return res.status(401).json({ message: "No autorizado" });
      }

      const profile = await customerService.getCustomerProfile(customerId);

      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error: any) {
      console.error("Error al obtener perfil del cliente:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }) as RequestHandler,

  createAddress: (async (req, res) => {
    try {
      const customerId = req.user?.id;
      console.log("BODY:", req.body);

      if (!customerId) {
        return res.status(401).json({ message: "No autorizado" });
      }

      const newAddress = await customerService.createAddress(
        customerId,
        req.body
      );

      res.status(201).json({
        success: true,
        message: "Dirección registrada correctamente.",
        data: newAddress,
      });
    } catch (error: any) {
      console.error("Error al guardar dirección:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }) as RequestHandler,

  getAddresses: (async (req, res) => {
    try {
      const customerId = req.user?.id;

      if (!customerId) {
        return res.status(401).json({ message: "No autorizado" });
      }

      const addresses = await customerService.getCustomerAddresses(customerId);

      res.status(200).json({
        success: true,
        data: addresses,
      });
    } catch (error: any) {
      console.error("Error al obtener direcciones:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }) as RequestHandler,

  updateAddress: (async (req, res) => {
    try {
      const customerId = req.user?.id;
      const addressId = parseInt(req.params.id);

      if (!customerId) {
        return res.status(401).json({ message: "No autorizado" });
      }

      const updated = await customerService.updateAddress(
        customerId,
        addressId,
        req.body
      );

      res.status(200).json({
        success: true,
        message: "Dirección actualizada correctamente.",
        data: updated,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error al actualizar dirección.",
      });
    }
  }) as RequestHandler,

  deleteAddress: (async (req, res) => {
    try {
      const customerId = req.user?.id;
      const addressId = parseInt(req.params.id);

      if (!customerId) {
        return res.status(401).json({ message: "No autorizado" });
      }

      await customerService.softDeleteAddress(customerId, addressId);

      res.status(200).json({
        success: true,
        message: "Dirección desactivada correctamente.",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error al desactivar dirección.",
      });
    }
  }) as RequestHandler,
};
