/*
  Warnings:

  - You are about to drop the column `gcm` on the `Site` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Site" RENAME COLUMN "gcm" TO "gsm";
