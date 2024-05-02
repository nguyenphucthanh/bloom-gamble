import { endOfDay, parse, startOfDay } from "date-fns";
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
    .query(async ({ input, ctx }) => {
      const dateFrom = startOfDay(
        parse(input.dateFrom, "yyyy-MM-dd", new Date()),
      ).toISOString();
      const dateTo = endOfDay(
        parse(input.dateTo, "yyyy-MM-dd", new Date()),
      ).toISOString();

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
});

export default userProfilePoints;
