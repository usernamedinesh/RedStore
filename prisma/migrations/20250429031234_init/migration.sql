-- CreateTable
CREATE TABLE "TempOtp" (
    "id" SERIAL NOT NULL,
    "otp" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TempOtp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TempOtp_email_key" ON "TempOtp"("email");
