/*
  Warnings:

  - You are about to drop the column `raw` on the `NotarizedData` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "NotarizedData" DROP COLUMN "raw",
ADD COLUMN     "sequence_number" TEXT;
