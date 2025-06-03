import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const requiredVariables = ["DATABASE_URL", "JWT_SECRET"];
requiredVariables.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Environment variable ${varName} is missing`);
  }
});

export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  JWT_SECRET: process.env.JWT_SECRET! as string,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || "12"),
  PORT: parseInt(process.env.PORT || "3000"),
  HOST: process.env.HOST || "localhost",
  EMAIL_USER: process.env.EMAIL_USER!,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD!,
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || 'soporte@foodius.com',
  APP_NAME: process.env.APP_NAME || 'Foodius'
};


