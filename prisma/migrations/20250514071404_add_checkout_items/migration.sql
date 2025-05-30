/*
  Warnings:

  - You are about to drop the `CartItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_userId_fkey";

-- DropTable
DROP TABLE "CartItem";

-- CreateTable
CREATE TABLE "checkout_items" (
    "id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "variant_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3),

    CONSTRAINT "checkout_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "checkout_items_user_id_idx" ON "checkout_items"("user_id");

-- CreateIndex
CREATE INDEX "checkout_items_variant_id_idx" ON "checkout_items"("variant_id");

-- AddForeignKey
ALTER TABLE "checkout_items" ADD CONSTRAINT "checkout_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkout_items" ADD CONSTRAINT "checkout_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("variant_id") ON DELETE CASCADE ON UPDATE CASCADE;
