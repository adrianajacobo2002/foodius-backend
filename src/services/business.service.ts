import prisma from "../config/database";
import { RegisterBusinessRequest } from "../types/business.request";
import { hashPassword } from "../utils/auth/bcrypt.utils";
import { sendEmail } from "./email.service";
import {
  buildApprovedEmail,
  buildRegistrationEmail,
} from "../emails/business-emails";



import { buildRejectedEmail } from "../emails/business-emails";





export const businessService = {
  async registerBusiness(data: RegisterBusinessRequest) {
    const existing = await prisma.businesses.findFirst({
      where: {
        OR: [
          { email: data.email },
          { phone_number: data.phone_number },
        ],
      },
    });

    if (existing) {
      throw new Error("El correo o teléfono ya están registrados.");
    }

    const hashedPassword = await hashPassword(data.password);

    const business = await prisma.businesses.create({
      data: {
        name: data.name,
        email: data.email,
        phone_number: data.phone_number,
        password: hashedPassword,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        logo: data.logo || "",
        banner: data.banner || "",
        bank_account_number: data.bank_account_number || "",
        bank_name: data.bank_name || "",
        approval_status: "PENDING",
        is_active: true,
        slug: data.name.toLowerCase().replace(/\s+/g, "-"),
      },
    });

    await sendEmail({
      to: business.email,
      subject: "Registro recibido - Foodius",
      html: buildRegistrationEmail({
        email: business.email,
        businessName: business.name,
      }),
    });

    return {
      id: business.id,
      name: business.name,
      email: business.email,
      status: "PENDING_APPROVAL",
    };
  },


  //para aprobar un negocio

  async approveBusiness(id: number) {
    const business = await prisma.businesses.findUnique({ where: { id } });

    if (!business) {
      throw new Error("Negocio no encontrado.");
    }

    if (business.approval_status === "APPROVED") {
      throw new Error("El negocio ya ha sido aprobado.");
    }

    const updated = await prisma.businesses.update({
      where: { id },
      data: { approval_status: "APPROVED" },
    });


    

    //creacion del usuario del negocio

    await prisma.users.create({
      data: {
        first_name: business.name, // o algún campo derivado
        last_names: "Negocio",     // puedes ajustar esto
        email: business.email,
        phone_number: business.phone_number,
        password: business.password, // ya está hasheado
        role: "BUSINESS",
      },
    });


    await sendEmail({
      to: updated.email,
      subject: "Negocio aprobado - Foodius",
      html: buildApprovedEmail({
        email: updated.email,
        businessName: updated.name,
      }),
    });

    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      status: "APPROVED",
    };
  },


//para rechazar un negocio

  async rejectBusiness(id: number) {
    const business = await prisma.businesses.findUnique({ where: { id } });

    if (!business) {
      throw new Error("Negocio no encontrado.");
    }

    if (business.approval_status === "REJECTED") {
      throw new Error("El negocio ya ha sido rechazado.");
    }

    const updated = await prisma.businesses.update({
      where: { id },
      data: { approval_status: "REJECTED" },
    });

    await sendEmail({
      to: updated.email,
      subject: "Solicitud rechazada - Foodius",
      html: buildRejectedEmail({
        email: updated.email,
        businessName: updated.name,
      }),
    });

    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      status: "REJECTED",
    };
  },



//para obtener todos los negocios o por estado

getAllBusinesses: () => prisma.businesses.findMany(),

  getBusinessesByStatus: (status: "PENDING" | "APPROVED" | "REJECTED") => {
    return prisma.businesses.findMany({
      where: {
        approval_status: status,
      },
    });
  },



};
