-- CreateTable
CREATE TABLE "Bet" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "game_id" UUID NOT NULL,
    "teamA" TEXT NOT NULL,
    "teamB" TEXT NOT NULL,
    "teamAResult" INTEGER,
    "teamBResult" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BetPlayer" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userProfile_id" UUID NOT NULL,
    "bet_id" UUID NOT NULL,
    "betAmout" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "BetPlayer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BetPlayer" ADD CONSTRAINT "BetPlayer_userProfile_id_fkey" FOREIGN KEY ("userProfile_id") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BetPlayer" ADD CONSTRAINT "BetPlayer_bet_id_fkey" FOREIGN KEY ("bet_id") REFERENCES "Bet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
