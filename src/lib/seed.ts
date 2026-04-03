import bcrypt from "bcrypt";
import prisma from "./prisma";

async function main() {
  const existingAdmin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (existingAdmin) {
    console.log("Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash("admin123", 7);

  await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin user created");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
