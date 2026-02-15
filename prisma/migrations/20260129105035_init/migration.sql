-- CreateEnum
CREATE TYPE "SiteTipo" AS ENUM ('REPETIDORA', 'CONCENTRADORA');

-- CreateEnum
CREATE TYPE "EnergiaTipo" AS ENUM ('BIFASICA', 'TRIFASICA');

-- CreateEnum
CREATE TYPE "AcessoTipo" AS ENUM ('CHAVE', 'BRUTF');

-- CreateTable
CREATE TABLE "Site" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "tipo" "SiteTipo" NOT NULL,
    "energia" "EnergiaTipo" NOT NULL,
    "acesso" "AcessoTipo" NOT NULL,
    "cabmil" BOOLEAN NOT NULL DEFAULT false,
    "bateria" BOOLEAN NOT NULL DEFAULT false,
    "bateriaQty" INTEGER NOT NULL DEFAULT 0,
    "gcm" BOOLEAN NOT NULL DEFAULT false,
    "has5g" BOOLEAN NOT NULL DEFAULT false,
    "observation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Site_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Site_code_key" ON "Site"("code");
