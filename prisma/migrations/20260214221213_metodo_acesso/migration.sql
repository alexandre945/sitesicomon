/*
  Warnings:

  - You are about to drop the column `acesso` on the `Site` table. All the data in the column will be lost.
  - Added the required column `metodoAcesso` to the `Site` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MetodoAcesso" AS ENUM ('CHAVE', 'SEGREDO', 'BRUTF');

-- AlterEnum
ALTER TYPE "SiteTipo" ADD VALUE 'SITE';

-- AlterTable
ALTER TABLE "Site" DROP COLUMN "acesso",
ADD COLUMN     "metodoAcesso" "MetodoAcesso" NOT NULL,
ADD COLUMN     "ntpCode" TEXT,
ADD COLUMN     "segredoNumero" TEXT;

-- DropEnum
DROP TYPE "AcessoTipo";
