-- CreateTable
CREATE TABLE "drones" (
    "id" TEXT NOT NULL,
    "serial" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "fabricante" TEXT NOT NULL,
    "peso" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "drones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "drones_serial_key" ON "drones"("serial");
