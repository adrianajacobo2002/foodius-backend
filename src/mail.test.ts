import { sendEmail } from "./services/email.service";
import { env } from "./config/env";

async function testEmail() {
  try {
    await sendEmail({
      to: 'Chr1st0phercrrv@gmail.com', // puedes poner otro destinatario aquí
      subject: "📬 Hemos secuestrado tus fotos con éxito!! :)",
      html: `
        <div style="font-family: sans-serif;">
          <h2 style="color: #2d3748;">¡Correo de prueba enviado con éxito!</h2>
          <p>Esto confirma que la configuración de Nodemailer funciona correctamente 🚀</p>
          <p><strong>Origen:</strong> ${env.EMAIL_USER}</p>
        </div>
      `,
    });

    console.log("✅ Correo de prueba enviado exitosamente.");
  } catch (error) {
    console.error("Error al enviar el correo de prueba:", error);
  }
}

testEmail();
