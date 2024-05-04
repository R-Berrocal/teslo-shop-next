/*
  Warnings:

  - Made the column `address` on table `OrderAddress` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "OrderAddress" ADD COLUMN     "address2" TEXT,
ALTER COLUMN "address" SET NOT NULL;
