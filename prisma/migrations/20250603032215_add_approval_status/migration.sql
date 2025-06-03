/*
  Warnings:

  - You are about to drop the column `is_approved` on the `Businesses` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "BUSINESS_APPROVAL_STATUS" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterEnum
ALTER TYPE "USER_ROLE" ADD VALUE 'BUSINESS';

-- AlterTable
ALTER TABLE "Businesses" DROP COLUMN "is_approved",
ADD COLUMN     "approval_status" "BUSINESS_APPROVAL_STATUS" NOT NULL DEFAULT 'PENDING';
