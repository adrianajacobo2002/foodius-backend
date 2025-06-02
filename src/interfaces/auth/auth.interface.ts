import { Prisma } from '../../../generated/prisma'; 

type SafeUser = Omit<Prisma.UsersGetPayload<{}>, 'password'>;

export interface AuthResponse {
  user: SafeUser;
  token: string;
}