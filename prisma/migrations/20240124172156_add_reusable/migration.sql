-- DropIndex
DROP INDEX "Referral_code_key";

-- AlterTable
ALTER TABLE "Code" ADD COLUMN     "reusable" BOOLEAN NOT NULL DEFAULT false;
