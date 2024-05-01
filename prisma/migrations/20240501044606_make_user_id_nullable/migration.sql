/*
  Warnings:

  - You are about to drop the column `createdById` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `hostedByUserId` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_createdById_fkey";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "createdById",
DROP COLUMN "hostedByUserId",
ADD COLUMN     "createdBy" UUID,
ADD COLUMN     "hostedBy" UUID,
ALTER COLUMN "id" SET DEFAULT gen_random_uuid(),
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "email" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "name" TEXT,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "UserProfile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_hostedBy_fkey" FOREIGN KEY ("hostedBy") REFERENCES "UserProfile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
