-- CreateTable
CREATE TABLE "VariantImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,

    CONSTRAINT "VariantImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VariantImage" ADD CONSTRAINT "VariantImage_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("variant_id") ON DELETE RESTRICT ON UPDATE CASCADE;
