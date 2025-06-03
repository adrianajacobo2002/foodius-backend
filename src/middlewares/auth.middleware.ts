import {Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth/jwt.utils'
import { PrismaClient } from '../../generated/prisma';
import { USER_ROLE } from '../../generated/prisma';

const prisma = new PrismaClient();

export const authenticate = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

        if(!token){
            return res.status(401).json({ message: 'Acceso no autorizado: Token no proporcionado' });
        }

        const decoded = verifyToken(token);
        const user = await prisma.users.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                role: true,
                is_active: true
            }
        });

        if(!user ||  !user.is_active){
            return res.status(401).json({ message: 'Acceso no autorizado: Usuario no válido '})
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Acceso no autorizado: Token inválido '})
    }
};

export const restrictTo = (...roles: USER_ROLE[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Acceso prohibido: Requiere rol ${roles.join(' o ')}` 
      });
    }
    next();
  };
};