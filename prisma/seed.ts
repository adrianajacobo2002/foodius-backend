// prisma/seed.ts o scripts/seed.ts

import { PrismaClient } from "../generated/prisma"; // Ajusta la ruta si es diferente
import { hashPassword } from "../src/utils/auth/bcrypt.utils"; // Asegúrate que la ruta sea correcta

const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.users.findFirst({
    where: {
      email: "admin@admin.com",
    },
  });

  if (existingAdmin) {
    console.log("🟡 Admin ya existe, no se insertó.");
    return;
  }

  const hashedPassword = await hashPassword("admin");

  await prisma.users.create({
    data: {
      first_name: "admin",
      last_names: "admin",
      email: "admin@admin.com",
      phone_number: "00000000",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin creado correctamente.");
}

main()
  .catch((e) => {
    console.error("❌ Error en seeder:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
