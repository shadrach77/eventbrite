/*
  Warnings:

  - You are about to drop the column `email` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `full_name` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `profile_picture` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `organizers` table. All the data in the column will be lost.
  - You are about to drop the column `full_name` on the `organizers` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `organizers` table. All the data in the column will be lost.
  - You are about to drop the column `profile_picture` on the `organizers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `customers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `organizers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `organizers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Organizer', 'Customer');

-- DropIndex
DROP INDEX "customers_email_key";

-- DropIndex
DROP INDEX "organizers_password_key";

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "email",
DROP COLUMN "full_name",
DROP COLUMN "password",
DROP COLUMN "profile_picture",
ADD COLUMN     "user_id" TEXT NOT NULL,
ALTER COLUMN "points" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "organizers" DROP COLUMN "email",
DROP COLUMN "full_name",
DROP COLUMN "password",
DROP COLUMN "profile_picture",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "profile_picture" TEXT,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_password_key" ON "users"("password");

-- CreateIndex
CREATE UNIQUE INDEX "customers_user_id_key" ON "customers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "organizers_user_id_key" ON "organizers"("user_id");

-- AddForeignKey
ALTER TABLE "organizers" ADD CONSTRAINT "organizers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
