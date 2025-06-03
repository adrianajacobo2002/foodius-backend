import { z } from "zod";

export const CreateAddressSchema = z.object({
  label: z.string().min(2).max(50).optional().default("Otra"),
  location: z.string().min(5, "La dirección es requerida"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  reference_point: z.string().min(2).max(255),
  is_default: z.boolean().optional().default(false),
});

export type CreateAddressRequest = z.infer<typeof CreateAddressSchema>;

export const UpdateAddressSchema = z.object({
  label: z.string().min(2).max(50).optional(),
  location: z.string().min(5),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  reference_point: z.string().min(2).max(255),
  is_default: z.boolean().optional(),
});

export type UpdateAddressRequest = z.infer<typeof UpdateAddressSchema>;

export const CreateOrderSchema = z.object({
  address_id: z.number(),
  items: z.array(
    z.object({
      food_id: z.number(),
      quantity: z.number().min(1)
    })
  ).min(1),
  payment_method: z.enum(["UPON_DELIVERY", "WOMPI"]),
  delivery_method: z.enum(["UPON_DELIVERY", "HOME_DELIVERY"])
});

export type CreateOrderRequest = z.infer<typeof CreateOrderSchema>;