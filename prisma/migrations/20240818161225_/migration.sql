/*
  Warnings:

  - A unique constraint covering the columns `[accountId]` on the table `Device` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Device_accountId_key" ON "Device"("accountId");
