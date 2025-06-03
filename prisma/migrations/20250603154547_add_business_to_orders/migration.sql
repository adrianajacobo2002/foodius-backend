/*
  Warnings:

  - Added the required column `id_business` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "id_business" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_id_business_fkey" FOREIGN KEY ("id_business") REFERENCES "Businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
