/*
  Warnings:

  - You are about to drop the `status` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "status" DROP CONSTRAINT "status_transaction_id_fkey";

-- DropTable
DROP TABLE "status";
