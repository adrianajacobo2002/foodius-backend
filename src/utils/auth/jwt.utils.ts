import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../../config/env";

interface JwtPayload {
  id: number;
}

export const generateToken = (userId: number): string => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};
