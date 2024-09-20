/*
  Warnings:

  - You are about to drop the column `address` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `machineId` on the `Device` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[publicKey]` on the table `Device` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `publicKey` to the `Device` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Device" DROP COLUMN "address",
DROP COLUMN "machineId",
ADD COLUMN     "publicKey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Device_publicKey_key" ON "Device"("publicKey");
