import bcrypt from "bcryptjs";
import { env } from "../../config/env";

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
};

export const comparePasswords = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
