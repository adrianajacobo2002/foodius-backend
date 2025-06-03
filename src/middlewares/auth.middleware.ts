import { Request, Response, NextFunction, RequestHandler } from "express";
import { verifyToken } from "../utils/auth/jwt.utils";
import { PrismaClient } from "../../generated/prisma";
import { USER_ROLE } from "../../generated/prisma";
import { asyncHandler } from "../utils/asyncHandler";

const prisma = new PrismaClient();

export const authenticate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;

  if (!token) {
    res.status(401).json({ message: "Acceso no autorizado: Token no proporcionado" });
    return;
  }

  const decoded = verifyToken(token);
  const user = await prisma.users.findUnique({
    where: { id: decoded.id },
    select: {
      id: true,
      email: true,
      role: true,
      is_active: true,
    },
  });

  if (!user || !user.is_active) {
    res.status(401).json({ message: "Acceso no autorizado: Usuario no válido" });
    return;
  }

  req.user = user;
  next();
});

// Esta es la parte crítica: tipamos manualmente la función retornada
export const restrictTo = (...roles: USER_ROLE[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        message: `Acceso prohibido: Requiere rol ${roles.join(" o ")}`,
      });
      return;
    }
    next();
  };
};
