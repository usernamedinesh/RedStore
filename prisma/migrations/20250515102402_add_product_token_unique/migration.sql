/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `ProductOwer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProductOwer_token_key" ON "ProductOwer"("token");
