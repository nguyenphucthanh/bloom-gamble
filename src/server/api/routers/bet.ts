import { BetInputSchema, BetPlayerSchema } from "@/validations/schemas";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { formatUTCDate, TIME_FORMATS } from "@/lib/datetime";

const betRoute = createTRPCRouter({
  getBets: publicProcedure.query(async ({ ctx }) => {
    const tenDaysAgo = new Date(
      new Date().getTime() - 10 * 24 * 60 * 60 * 1000
    );
    const bets = await ctx.supabase
      .from("Bet")
      .select("*, UserProfile (id, name)")
      .gte("createdAt", formatUTCDate(tenDaysAgo, TIME_FORMATS.SUPABASE_DATE))
      .order("createdAt", { ascending: false });

    if (bets.error) {
      throw new Error(bets.error.message);
    }
    return bets.data;
  }),
  getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const bet = await ctx.supabase
      .from("Bet")
      .select()
      .eq("id", input)
      .maybeSingle();

    if (bet.error) {
      throw new Error(bet.error.message);
    }

    return bet.data;
  }),
  setBetLock: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, "Please enter bet ID"),
        locked: z.boolean(),
        teamAResult: z.number().min(0).nullable().optional(),
        teamBResult: z.number().min(0).nullable().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.supabase
        .from("Bet")
        .update({
          locked: input.locked,
          teamAResult: input.teamAResult,
          teamBResult: input.teamBResult,
        })
        .eq("id", input.id)
        .eq("createdBy", ctx.session.profile.id)
        .select()
        .maybeSingle();

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result.data;
    }),
  create: protectedProcedure
    .input(BetInputSchema)
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from("Bet")
        .insert({
          teamA: input.teamA,
          teamB: input.teamB,
          createdBy: ctx.session.profile.id,
        })
        .select()
        .single();

      if (!data?.id) {
        throw new Error(error?.message ?? "No bet was created");
      }

      return data;
    }),
  createBetPlayer: protectedProcedure
    .input(BetPlayerSchema)
    .mutation(async ({ ctx, input }) => {
      const betPlayer = await ctx.supabase
        .from("BetPlayer")
        .insert({
          userProfile_id: ctx.session.profile.id,
          bet_id: input.betId,
          betAmount: input.betAmount,
          team: input.team,
        })
        .select()
        .maybeSingle();
      return betPlayer;
    }),
  cancelBetPlayer: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      if (!input) {
        throw new Error("Please identify bet player");
      }
      const betPlayer = await ctx.supabase
        .from("BetPlayer")
        .delete()
        .eq("id", input)
        .select()
        .maybeSingle();
      return betPlayer;
    }),
  updateBetPlayer: protectedProcedure
    .input(BetPlayerSchema)
    .mutation(async ({ ctx, input }) => {
      if (!input.id) {
        throw new Error("Please identify bet player");
      }
      const betPlayer = await ctx.supabase
        .from("BetPlayer")
        .update({
          betAmount: input.betAmount,
          team: input.team,
        })
        .eq("id", input.id)
        .select()
        .maybeSingle();
      return betPlayer;
    }),
  getBetPlayers: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const result = await ctx.supabase
        .from("BetPlayer")
        .select("*, UserProfile(id, name)")
        .eq("bet_id", input);

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result.data;
    }),
  getBetPlayerByUserProfileId: publicProcedure
    .input(
      z.object({
        betId: z.string(),
        userProfileId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.supabase
        .from("BetPlayer")
        .select("*")
        .eq("bet_id", input.betId)
        .eq("userProfile_id", input.userProfileId)
        .maybeSingle();

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result.data;
    }),
});

export default betRoute;
