// makeAdmin.js
const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

async function makeAdmin() {
  try {
    await prisma.user.update({
      where: { email: "dipenboro432@gmail.com" },
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

// makeAdmin();
// lets see user exist or not

// const user = await Prisma.user.findFirst({
//   where: findCondition,
// });

findCondition = {
  email: "dinesh@gmail.com ",
};
async function makeAdmin() {
  const user = await prisma.user.findFirst({
    where: { id: 2 },
    select: {
      id: true,
      email: true,
      name: true,
      refreshToken: true,
    },
  });
  console.log("User found: ", user);
}
makeAdmin();
