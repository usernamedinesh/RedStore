/*
  Warnings:

  - A unique constraint covering the columns `[phoneNo]` on the table `TempOtp` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phoneNo` to the `TempOtp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TempOtp" ADD COLUMN     "phoneNo" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TempOtp_phoneNo_key" ON "TempOtp"("phoneNo");
