import { z } from "zod";

export const RegisterBusinessRequestSchema = z.object({
  name: z.string().min(3).max(255),
  email: z.string().email(),
  phone_number: z.string().length(8),
  password: z.string().min(8),
  location: z.string(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  logo: z.string().optional().default(""),
  banner: z.string().optional().default(""),
  bank_account_number: z.string().optional().default(""),
  bank_name: z.string().optional().default(""),
});

export type RegisterBusinessRequest = z.infer<
  typeof RegisterBusinessRequestSchema
>;
