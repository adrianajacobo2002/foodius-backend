import { USER_ROLE } from "../../generated/prisma";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: USER_ROLE;
        is_active: boolean;
      };
    }
  }
}