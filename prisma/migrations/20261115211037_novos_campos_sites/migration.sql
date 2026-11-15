-- CreateEnum
CREATE TYPE "CondicaoEstrada" AS ENUM ('VEICULO_PEQUENO', 'SOMENTE_4X4', 'INTRANSITAVEL');

-- CreateEnum
CREATE TYPE "TipoBateria" AS ENUM ('LITIO', 'CHUMBO_ACIDO', 'OUTRA');

-- AlterEnum
ALTER TYPE "MetodoAcesso" ADD VALUE 'CABMIL';

-- AlterTable
ALTER TABLE "Site" ADD COLUMN     "acessoGabinetes" TEXT,
ADD COLUMN     "condicaoEstrada" "CondicaoEstrada",
ADD COLUMN     "has3g" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "has4g" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tecnicoAtualizacao" TEXT,
ADD COLUMN     "tecnicoCadastro" TEXT,
ADD COLUMN     "tipoBateria" "TipoBateria",
ADD COLUMN     "ultimaVerificacao" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "SiteFoto" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "descricao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SiteFoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteHistorico" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "tecnico" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SiteHistorico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SiteFoto_siteId_idx" ON "SiteFoto"("siteId");

-- CreateIndex
CREATE INDEX "SiteHistorico_siteId_idx" ON "SiteHistorico"("siteId");

-- AddForeignKey
ALTER TABLE "SiteFoto" ADD CONSTRAINT "SiteFoto_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteHistorico" ADD CONSTRAINT "SiteHistorico_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;
