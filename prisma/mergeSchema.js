const fs = require("fs");
const path = require("path");

// Paths
const schemaPath = path.join(__dirname, "schema.prisma");
const modelsDir = path.join(__dirname, "models");

// Read your schema.prisma template (keep generator and datasource part here)
let baseSchema = `
generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Models start here
`;

// Read all model files inside prisma/models
const modelFiles = fs
  .readdirSync(modelsDir)
  .filter((file) => file.endsWith(".prisma"));

for (const file of modelFiles) {
  const content = fs.readFileSync(path.join(modelsDir, file), "utf-8");
  baseSchema += "\n" + content + "\n";
}

// Finally, write the combined schema into schema.prisma
fs.writeFileSync(schemaPath, baseSchema);

console.log("✅ Merged models into schema.prisma successfully!");
