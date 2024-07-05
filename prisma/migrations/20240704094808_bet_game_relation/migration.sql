-- DropForeignKey
ALTER TABLE "Bet" DROP CONSTRAINT "Bet_game_id_fkey";

-- AlterTable
ALTER TABLE "Bet" ALTER COLUMN "game_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;
