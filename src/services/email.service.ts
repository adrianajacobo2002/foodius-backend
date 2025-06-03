import nodemailer from "nodemailer";
import { env } from "../config/env";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: EmailOptions): Promise<void> => {
  try {
    await transporter.sendMail({
      from: `"${env.APP_NAME}" <${env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email enviado a ${to}`);
  } catch (error) {
    console.error("Error al enviar email:", error);
  }
};
