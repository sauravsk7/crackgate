-- CreateEnum
CREATE TYPE "UpiClaimStatus" AS ENUM ('pending', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "image" TEXT,
ALTER COLUMN "name" DROP NOT NULL;

-- CreateTable
CREATE TABLE "UpiPayment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" "Plan" NOT NULL,
    "amountPaise" INTEGER NOT NULL,
    "periodMonths" INTEGER NOT NULL DEFAULT 18,
    "upiTxnRef" TEXT NOT NULL,
    "upiApp" TEXT,
    "payerNote" TEXT,
    "status" "UpiClaimStatus" NOT NULL DEFAULT 'pending',
    "adminNote" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UpiPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UpiPayment_upiTxnRef_key" ON "UpiPayment"("upiTxnRef");

-- CreateIndex
CREATE INDEX "UpiPayment_userId_createdAt_idx" ON "UpiPayment"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "UpiPayment_status_createdAt_idx" ON "UpiPayment"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "UpiPayment" ADD CONSTRAINT "UpiPayment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

