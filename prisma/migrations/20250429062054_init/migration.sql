/*
  Warnings:

  - You are about to drop the column `expiresTime` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "expiresTime",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL DEFAULT (NOW() + interval '5 minutes');
