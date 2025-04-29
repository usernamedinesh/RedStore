/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `User` table. All the data in the column will be lost.
  - Added the required column `expiresTime` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "expiresAt",
ADD COLUMN     "expiresTime" TIMESTAMP(3) NOT NULL;
