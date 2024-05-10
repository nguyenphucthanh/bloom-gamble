import { createTRPCRouter, publicProcedure } from "../trpc";
import * as z from "zod";

const userProfilePoints = createTRPCRouter({
  reportByDate: publicProcedure
    .input(
      z.object({
        dateFrom: z.string(),
        dateTo: z.string(),
        gameType: z.string(),
      }),
    )
    .output(
      z.array(
        z.object({
          name: z.string(),
          point: z.number(),
        }),
      ),
    )
    .query(async ({ input, ctx }) => {
      const { dateFrom, dateTo } = input;

      console.log(dateFrom, dateTo);
      const gameResponse = await ctx.supabase
        .from("Game")
        .select()
        .eq("gameType", input.gameType)
        .gte("createdAt", dateFrom)
        .lte("createdAt", dateTo);

      if (gameResponse.error) {
        throw new Error(gameResponse.error.message);
      }

      const gameIds = gameResponse.data?.map((game) => game.id) ?? [];
      interface ResponseItem {
        userProfile_id: string;
        UserProfile: {
          name: string;
          id: string;
        };
        sum: number;
      }
      const response = await ctx.supabase
        .from("UserProfilePoint")
        .select("userProfile_id, points.sum(), UserProfile (id, name)")
        .in("game_id", gameIds);

      if (response.error) {
        throw new Error(response.error.message);
      }

      return (response.data as unknown as ResponseItem[]).flatMap(
        (item: ResponseItem) => {
          return {
            name: item.UserProfile.name,
            point: item.sum,
          };
        },
      );
    }),

  reportByUser: publicProcedure
    .input(z.string())
    .output(z.array(z.object({ gameType: z.string(), point: z.number() })))
    .query(async ({ input, ctx }) => {
      const value = input;
      const isEmail = value.includes("@");
      const userProfileResponse = await ctx.supabase
        .from("UserProfile")
        .select("id")
        .eq(isEmail ? "email" : "user_id", value);

      if (userProfileResponse.error) {
        throw new Error(userProfileResponse.error.message);
      }

      const pointsResponse = await ctx.supabase
        .from("UserProfilePoint")
        .select("game_id, points.sum(), Game (id, gameType)")
        .eq("userProfile_id", userProfileResponse?.data?.[0]?.id);

      if (pointsResponse.error) {
        throw new Error(pointsResponse.error.message);
      }

      console.log(pointsResponse.data);

      interface ResponseItem {
        game_id: string;
        Game: {
          gameType: string;
          id: string;
        };
        sum: number;
      }

      return (pointsResponse.data as unknown as ResponseItem[]).map(
        (item: ResponseItem) => {
          return {
            gameType: item.Game.gameType,
            point: item.sum,
          };
        },
      );
    }),
});

export default userProfilePoints;
