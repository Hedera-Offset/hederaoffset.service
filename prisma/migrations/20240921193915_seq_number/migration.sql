/*
  Warnings:

  - The `sequence_number` column on the `NotarizedData` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "NotarizedData" DROP COLUMN "sequence_number",
ADD COLUMN     "sequence_number" INTEGER;
