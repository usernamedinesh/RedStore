/*
  Warnings:

  - You are about to drop the `ProductOwer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ProductOwer";

-- CreateTable
CREATE TABLE "ProductOwner" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "password" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "token" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "expiredAt" TIMESTAMP(3),

    CONSTRAINT "ProductOwner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductOwner_email_key" ON "ProductOwner"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ProductOwner_token_key" ON "ProductOwner"("token");
