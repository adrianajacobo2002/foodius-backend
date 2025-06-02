import { PrismaClient } from "../../generated/prisma";
import { hashPassword, comparePasswords } from "../utils/auth/bcrypt.utils";
import { generateToken } from "../utils/auth/jwt.utils";
import { AuthResponse } from "../interfaces/auth/auth.interface";
import { RegisterRequest } from "../types/auth/register.request";
import { LoginRequest } from "../types/auth/login.request";

const prisma = new PrismaClient();

export class AuthService{
    async register(userData: RegisterRequest): Promise<AuthResponse>{
        const existingUser = await prisma.users.findFirst({
            where:{
                OR: [
                    { email: userData.email },
                    { phone_number: userData.phone_number }
                ]
            }
        });

        if  (existingUser){
            throw new Error('El email o telefono ya están registrados')
        }
    }
}