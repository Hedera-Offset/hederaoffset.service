-- AlterTable
ALTER TABLE "User" ADD COLUMN     "machineAuthToken" TEXT,
ADD COLUMN     "publicKey" TEXT;

-- CreateTable
CREATE TABLE "Device" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "country" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "accountKey" TEXT NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotarizedData" (
    "id" SERIAL NOT NULL,
    "deviceId" INTEGER NOT NULL,
    "meter_type" TEXT,
    "time" TIMESTAMP(3) NOT NULL,
    "temprature" DECIMAL(65,30),
    "totalEnergy" DECIMAL(65,30),
    "today" DECIMAL(65,30),
    "power" INTEGER,
    "apparentPower" INTEGER,
    "reactivePower" INTEGER,
    "factor" DECIMAL(65,30),
    "voltage" INTEGER,
    "current" DECIMAL(65,30),
    "raw" TEXT,

    CONSTRAINT "NotarizedData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotarizedData" ADD CONSTRAINT "NotarizedData_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
