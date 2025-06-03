import { env } from "../config/env";

interface BusinessEmailData {
  businessName: string;
  email: string;
}

export const buildRegistrationEmail = ({ businessName }: BusinessEmailData): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2 style="color: #2d3748;">¡Gracias por registrarte en Foodius!</h2>
      <p style="color: #4a5568;">
        Hemos recibido tu solicitud para el negocio <strong>${businessName}</strong>. 
        Nuestro equipo la revisará pronto.
      </p>
      <p style="color: #4a5568;">
        Te notificaremos cuando tu cuenta haya sido aprobada.
      </p>
      <hr />
      <p style="color: #a0aec0; font-size: 0.875rem;">Equipo de Foodius • ${env.SUPPORT_EMAIL}</p>
    </div>
  `;
};

export const buildApprovedEmail = ({ businessName }: BusinessEmailData): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2 style="color: #2d3748;">¡Tu negocio ha sido aprobado!</h2>
      <p style="color: #4a5568;">
        El negocio <strong>${businessName}</strong> ya está listo para operar en Foodius.
      </p>
      <p style="color: #4a5568;">
        Puedes iniciar sesión con tus credenciales. Si necesitas asistencia, contáctanos a <a href="mailto:${env.SUPPORT_EMAIL}">${env.SUPPORT_EMAIL}</a>.
      </p>
      <hr />
      <p style="color: #a0aec0; font-size: 0.875rem;">Equipo de Foodius</p>
    </div>
  `;
};

//correo de solicitud rechazada
export const buildRejectedEmail = ({ businessName }: BusinessEmailData): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2 style="color: #e53e3e;">Tu solicitud ha sido rechazada</h2>
      <p style="color: #4a5568;">
        Lamentamos informarte que la solicitud para el negocio <strong>${businessName}</strong> ha sido denegada.
      </p>
      <p style="color: #4a5568;">
        Si crees que se trata de un error o deseas más información, puedes comunicarte con nuestro equipo de soporte a <a href="mailto:${env.SUPPORT_EMAIL}">${env.SUPPORT_EMAIL}</a>.
      </p>
      <hr />
      <p style="color: #a0aec0; font-size: 0.875rem;">Equipo de Foodius</p>
    </div>
  `;
};
