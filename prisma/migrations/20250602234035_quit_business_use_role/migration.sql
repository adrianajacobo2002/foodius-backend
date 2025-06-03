/*
  Warnings:

  - The values [BUSINESS] on the enum `USER_ROLE` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "USER_ROLE_new" AS ENUM ('CLIENT', 'ADMIN');
ALTER TABLE "Users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "Users" ALTER COLUMN "role" TYPE "USER_ROLE_new" USING ("role"::text::"USER_ROLE_new");
ALTER TYPE "USER_ROLE" RENAME TO "USER_ROLE_old";
ALTER TYPE "USER_ROLE_new" RENAME TO "USER_ROLE";
DROP TYPE "USER_ROLE_old";
ALTER TABLE "Users" ALTER COLUMN "role" SET DEFAULT 'CLIENT';
COMMIT;
