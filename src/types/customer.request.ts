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
