/*
  Warnings:

  - You are about to drop the column `location` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `profile_picture` on the `events` table. All the data in the column will be lost.
  - Added the required column `location_id` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `points_used` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "events" DROP COLUMN "location",
DROP COLUMN "profile_picture",
ADD COLUMN     "average_rating" INTEGER,
ADD COLUMN     "location_id" TEXT NOT NULL,
ADD COLUMN     "picture" TEXT;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "points_used" INTEGER NOT NULL,
ADD COLUMN     "promotion_used" TEXT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "points" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "locations_label_key" ON "locations"("label");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
