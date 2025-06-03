import { PrismaClient } from "../../generated/prisma";
import { hashPassword, comparePasswords } from "../utils/auth/bcrypt.utils";
import { generateToken } from "../utils/auth/jwt.utils";
import { AuthResponse } from "../interfaces/auth/auth.interface";
import { RegisterRequest } from "../types/auth/register.request";
import { LoginRequest } from "../types/auth/login.request";

const prisma = new PrismaClient();

export class AuthService {
    //REGISTRO
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { email: userData.email },
          { phone_number: userData.phone_number },
        ],
      },
    });

    if (existingUser) {
      throw new Error("El email o telefono ya están registrados");
    }

    const hashedPassword = await hashPassword(userData.password);

    const user = await prisma.users.create({
      data: {
        ...userData,
        password: hashedPassword,
        role: "CLIENT",
      },
    });

    const token = generateToken(user.id);

    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  //LOGIN
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const user = await prisma.users.findUnique({
      where: { email: credentials.email },
    });

    if (
      !user ||
      !(await comparePasswords(credentials.password, user.password))
    ) {
      throw new Error("Credenciales inválidas");
    }

    const token = generateToken(user.id);

    const { password, ...userWithoutPassword } = user;

    return {
      user: {
        ...userWithoutPassword,
        role: user.role,
      },
      token,
    };
  }
}
