-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "exam" TEXT,
ADD COLUMN     "subject" TEXT;

-- AlterTable
ALTER TABLE "UpiPayment" ADD COLUMN     "exam" TEXT,
ADD COLUMN     "subject" TEXT;

-- CreateTable
CREATE TABLE "Entitlement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "exam" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "tier" "Plan" NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'grant',
    "expiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Entitlement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Entitlement_exam_subject_idx" ON "Entitlement"("exam", "subject");

-- CreateIndex
CREATE UNIQUE INDEX "Entitlement_userId_exam_subject_key" ON "Entitlement"("userId", "exam", "subject");

-- AddForeignKey
ALTER TABLE "Entitlement" ADD CONSTRAINT "Entitlement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
