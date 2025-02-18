-- DropForeignKey
ALTER TABLE "transaction_tickets" DROP CONSTRAINT "transaction_tickets_transaction_id_fkey";

-- AddForeignKey
ALTER TABLE "transaction_tickets" ADD CONSTRAINT "transaction_tickets_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
