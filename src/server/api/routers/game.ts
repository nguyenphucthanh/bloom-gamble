import * as z from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

const gameRoute = createTRPCRouter({
  createGame: publicProcedure
    .input(
      z.object({
        gameType: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const gameType = input.gameType;

      const { data, error } = await ctx.supabase
        .from("Game")
        .insert({
          gameType: gameType,
          isEnded: false,
        })
        .select();

      if (error) {
        throw new Error(error.message);
      }

      return {
        game: data?.[0] || null,
      };
    }),

  endGame: publicProcedure
    .input(
      z.object({
        id: z.string(),
        players: z.array(
          z.object({
            userProfile_id: z.string(),
            points: z.number(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const gameResponse = await ctx.supabase
        .from("Game")
        .update({
          isEnded: true,
        })
        .eq("id", input.id);

      if (gameResponse.error) {
        throw new Error(gameResponse.error.message);
      }

      const response = await ctx.supabase
        .from("UserProfilePoint")
        .insert(
          input.players.map((player) => ({
            userProfile_id: player.userProfile_id,
            points: player.points,
            game_id: input.id,
          })),
        )
        .select();

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    }),
});

export default gameRoute;
