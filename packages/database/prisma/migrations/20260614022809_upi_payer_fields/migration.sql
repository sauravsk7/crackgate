-- DropIndex
DROP INDEX "UpiPayment_upiTxnRef_key";

-- AlterTable
ALTER TABLE "UpiPayment" ADD COLUMN     "payerEmail" TEXT,
ADD COLUMN     "payerName" TEXT,
ADD COLUMN     "payerPhone" TEXT,
ALTER COLUMN "upiTxnRef" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "UpiPayment_payerPhone_idx" ON "UpiPayment"("payerPhone");
