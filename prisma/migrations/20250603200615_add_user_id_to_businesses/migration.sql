/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `Businesses` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `Businesses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Businesses" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Businesses_user_id_key" ON "Businesses"("user_id");

-- AddForeignKey
ALTER TABLE "Businesses" ADD CONSTRAINT "Businesses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
