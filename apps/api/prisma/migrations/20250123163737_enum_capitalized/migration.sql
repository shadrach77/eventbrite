/*
  Warnings:

  - The values [Organizer,Customer] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - The values [PendingPayment,PendingAdminConfirmation,Done,Rejected,Expired,Canceled] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ORGANIZER', 'CUSTOMER');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'CUSTOMER';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('PENDING_PAYMENT', 'PENDING_ADMIN_CONFIRMATION', 'DONE', 'REJECTED', 'EXPIRED', 'CANCELED');
ALTER TABLE "transactions" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "transactions" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "transactions" ALTER COLUMN "status" SET DEFAULT 'PENDING_PAYMENT';
COMMIT;

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "status" SET DEFAULT 'PENDING_PAYMENT';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'CUSTOMER';
