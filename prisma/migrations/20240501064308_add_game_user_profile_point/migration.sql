-- CreateTable
CREATE TABLE "UserProfilePoint" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userProfile_id" UUID NOT NULL,
    "game_id" UUID NOT NULL,
    "points" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserProfilePoint_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserProfilePoint" ADD CONSTRAINT "UserProfilePoint_userProfile_id_fkey" FOREIGN KEY ("userProfile_id") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfilePoint" ADD CONSTRAINT "UserProfilePoint_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
