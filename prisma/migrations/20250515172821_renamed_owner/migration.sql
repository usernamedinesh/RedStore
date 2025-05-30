/*
  Warnings:

  - Added the required column `owner_id` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MessasageType" AS ENUM ('TEXT', 'IMAGE', 'VIDEO', 'AUDIO');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "owner_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "type" "MessasageType" NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text_content" TEXT,
    "file_url" TEXT,
    "senderUserId" INTEGER,
    "receiverUserId" INTEGER,
    "senderOwnerId" INTEGER,
    "receiverOwnerId" INTEGER,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderUserId_fkey" FOREIGN KEY ("senderUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverUserId_fkey" FOREIGN KEY ("receiverUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderOwnerId_fkey" FOREIGN KEY ("senderOwnerId") REFERENCES "ProductOwner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverOwnerId_fkey" FOREIGN KEY ("receiverOwnerId") REFERENCES "ProductOwner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "ProductOwner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
