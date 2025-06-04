/*
  Warnings:

  - Changed the type of `type` on the `Message` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'IMAGE', 'VIDEO', 'AUDIO');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "chatId" TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" "MessageType" NOT NULL;

-- DropEnum
DROP TYPE "MessasageType";
