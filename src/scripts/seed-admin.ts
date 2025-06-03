import prisma from "../config/database";
import { hashPassword } from "../utils/auth/bcrypt.utils";

async function seedAdmin() {
  const existing = await prisma.users.findFirst({
    where: { email: "admin@foodius.com" },
  });

  if (existing) {
    console.log("⚠️  El admin ya existe.");
    return;
  }

  const admin = await prisma.users.create({
    data: {
      first_name: "Admin",
      last_names: "Foodius",
      email: "admin@foodius.com",
      phone_number: "77777777",
      password: await hashPassword("admin123"),
      role: "ADMIN",
      is_active: true,
    },
  });

  console.log("✅ Admin creado:");
  console.log({
    email: admin.email,
    password: "admin123",
  });
}

seedAdmin()
  .catch((err) => {
    console.error("❌ Error al crear admin:", err);
  })
  .finally(() => {
    prisma.$disconnect();
  });
