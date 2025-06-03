import { RequestHandler } from "express";
import { customerService } from "../services/customer.service";
import { ORDER_STATES } from "../../generated/prisma";

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

  createOrder: (async (req, res) => {
    try {
      const customerId = req.user?.id;

      if (!customerId) {
        return res.status(401).json({ message: "No autorizado" });
      }

      const order = await customerService.createOrder(customerId, req.body);

      const subtotal = order.OrdersDetails.reduce((acc, item) => {
        return acc + Number(item.price) * item.quantity;
      }, 0);

      const total = subtotal + Number(order.service_fee);

      res.status(201).json({
        success: true,
        message: "Orden creada correctamente.",
        data: {
          ...order,
          subtotal: subtotal.toFixed(2),
          total: total.toFixed(2),
        },
      });
    } catch (error: any) {
      console.error("Error al crear orden:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Error interno al procesar la orden.",
      });
    }
  }) as RequestHandler,

  getOrders: (async (req, res) => {
    try {
      const customerId = req.user?.id;
      const state = req.query.state as ORDER_STATES | undefined;

      if (!customerId) {
        return res.status(401).json({ message: "No autorizado" });
      }

      const orders = await customerService.getCustomerOrders(customerId, state);

      res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error: any) {
      console.error("Error al obtener historial de órdenes:", error);
      res.status(500).json({
        success: false,
        message: "Error interno al obtener historial",
      });
    }
  }) as RequestHandler,

  getOrderById: (async (req, res) => {
    try {
      const customerId = req.user?.id;
      const orderId = parseInt(req.params.id);

      if (!customerId) {
        return res.status(401).json({ message: "No autorizado" });
      }

      if (isNaN(orderId)) {
        return res.status(400).json({ message: "ID de orden no válido" });
      }

      const order = await customerService.getOrderById(customerId, orderId);

      if (!order) {
        return res.status(404).json({ message: "Orden no encontrada" });
      }

      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error: any) {
      console.error("Error al obtener orden:", error);
      res.status(500).json({
        success: false,
        message: "Error interno al obtener orden",
      });
    }
  }) as RequestHandler,
};