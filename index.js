require("dotenv").config();
const app = require("./app");
const env = require("./config/envConfig");
const { PrismaClient } = require("./generated/prisma");
const prisma = new PrismaClient();

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("prisma disconnect!");
  process.exit(0);
});

const sever = app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});

// ================ ================ ================  GRACEFULLY SHUTDOWN  ================ ================ ================ ================
const shutdown = async () => {
  console.log("\nStarting gracefully shutdown ... !");
  try {
    /* Closed Http server */
    await new Promise((resolve) => sever.close(resolve));
    console.log("Http sever closed");

    /* Closed prisma connection */
    await prisma.$disconnect();
    console.log("prisma disconnect!");
    process.exit(0);
  } catch (error) {
    console.error("Shutdown error: ", error);
    process.exit(1);
  }
};

process.on("SIGINT", shutdown); // Ctrl + c
process.on("SIGTERM", shutdown); // Docker stop
