/*
  Warnings:

  - You are about to drop the column `promotion_used` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `ticket_type_id` on the `transactions` table. All the data in the column will be lost.
  - Added the required column `grand_total` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "promotion_used",
DROP COLUMN "quantity",
DROP COLUMN "ticket_type_id",
ADD COLUMN     "grand_total" INTEGER NOT NULL,
ADD COLUMN     "promotion_id" TEXT,
ADD COLUMN     "status" "StatusLabel" NOT NULL DEFAULT 'PENDING_PAYMENT',
ALTER COLUMN "points_used" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "transaction_tickets" (
    "id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,

    CONSTRAINT "transaction_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transaction_tickets_transaction_id_key" ON "transaction_tickets"("transaction_id");

-- AddForeignKey
ALTER TABLE "transaction_tickets" ADD CONSTRAINT "transaction_tickets_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
