import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { LoginRequest } from "../types/auth/login.request";
import { RegisterRequest } from "../types/auth/register.request";


export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async register(req: Request, res: Response) {
    try {
      const userData: RegisterRequest = req.body;
      const result = await this.authService.register(userData);

      res.status(201).json({
        success: true,
        data: {
          user: result.user,
          token: result.token,
        },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const credentials: LoginRequest = req.body;
      const result = await this.authService.login(credentials);

      res.json({
        success: true,
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            role: result.user.role,
          },
          token: result.token,
        },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async logout(req: Request, res: Response) {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({
      success: true,
      message: 'Sesión cerrada correctamente',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al cerrar sesión',
    });
  }
}
}

export const authController = new AuthController();
