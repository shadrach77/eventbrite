/*
  Warnings:

  - You are about to drop the `Status` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Status" DROP CONSTRAINT "Status_transaction_id_fkey";

-- DropTable
DROP TABLE "Status";

-- CreateTable
CREATE TABLE "status" (
    "id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "status" "StatusLabel" NOT NULL,

    CONSTRAINT "status_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "status_transaction_id_key" ON "status"("transaction_id");

-- AddForeignKey
ALTER TABLE "status" ADD CONSTRAINT "status_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
