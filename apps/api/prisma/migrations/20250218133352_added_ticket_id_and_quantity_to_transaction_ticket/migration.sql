/*
  Warnings:

  - Added the required column `quantity` to the `transaction_tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticket_id` to the `transaction_tickets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transaction_tickets" ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "ticket_id" TEXT NOT NULL;
