require("dotenv").config();
const app = require("./app");
const env = require("./config/envConfig");

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
