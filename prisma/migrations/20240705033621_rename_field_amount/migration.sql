/*
  Warnings:

  - You are about to drop the column `betAmout` on the `BetPlayer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BetPlayer" DROP COLUMN "betAmout",
ADD COLUMN     "betAmount" DECIMAL(65,30) NOT NULL DEFAULT 0;
