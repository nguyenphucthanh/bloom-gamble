import { createTRPCRouter, publicProcedure } from "../trpc";

const userProfileRoute = createTRPCRouter({
  profiles: publicProcedure.query(async ({ ctx }) => {
    const { count, data, error } = await ctx.supabase
      .from("UserProfile")
      .select("*");
    if (error) {
      throw new Error(error.message);
    }
    return {
      data,
      count,
    };
  }),
});

export default userProfileRoute;
