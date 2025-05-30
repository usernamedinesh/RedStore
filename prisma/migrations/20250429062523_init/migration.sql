/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `User` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `TempOtp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TempOtp" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "expiresAt";
