import { QuickUserGamePoint } from "@/models/game";
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
    .query<QuickUserGamePoint[]>(async ({ input, ctx }) => {
      const { dateFrom, dateTo } = input;

      const gameResponse = await ctx.supabase
        .from("Game")
        .select()
        .eq("gameType", input.gameType)
        .gte("createdAt", dateFrom)
        .lte("createdAt", dateTo)
        .order("createdAt", { ascending: true });

      if (gameResponse.error) {
        throw new Error(gameResponse.error.message);
      }

      if (!gameResponse.data?.length) {
        return [];
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
    .output(
      z.array(
        z.object({
          gameId: z.string(),
          gameType: z.string(),
          point: z.number(),
          gameDate: z.string(),
        }),
      ),
    )
    .query<QuickUserGamePoint[]>(async ({ input, ctx }) => {
      const value = input;
      const isEmail = value.includes("@");
      const userProfileResponse = await ctx.supabase
        .from("UserProfile")
        .select("id")
        .eq(isEmail ? "email" : "user_id", value)
        .maybeSingle();

      if (!userProfileResponse.data?.id) {
        throw new Error(
          userProfileResponse?.error?.message ?? "No user profile found",
        );
      }

      const pointsResponse = await ctx.supabase
        .from("UserProfilePoint")
        .select(
          "game_id, createdAt, points.sum(), Game (id, gameType, createdAt)",
        )
        .eq("userProfile_id", userProfileResponse?.data?.id)
        .order("createdAt", { ascending: true });

      if (pointsResponse.error) {
        throw new Error(pointsResponse.error.message);
      }

      interface ResponseItem {
        game_id: string;
        Game: {
          gameType: string;
          id: string;
          createdAt: string;
        };
        sum: number;
      }

      return (pointsResponse.data as unknown as ResponseItem[]).map(
        (item: ResponseItem) => {
          return {
            gameId: item.game_id,
            gameType: item.Game.gameType,
            point: item.sum,
            gameDate: item.Game.createdAt,
          };
        },
      );
    }),
});

export default userProfilePoints;
