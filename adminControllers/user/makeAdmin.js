// makeAdmin.js
const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

async function makeAdmin() {
  try {
    await prisma.user.update({
      where: { email: "myaovalor@gmail.com" },
      data: {
        userRole: "ADMIN",
      },
    });
    console.log("Admin role assigned successfully!");
  } catch (err) {
    console.error("Failed to assign admin role:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

makeAdmin();
