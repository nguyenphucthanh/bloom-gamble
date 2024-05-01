import { createTRPCRouter, publicProcedure } from "../trpc";

const userRoute = createTRPCRouter({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getUser: publicProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase.auth.getUser();

    if (error) {
      throw new Error(error.message);
    }

    return data.user;
  }),
  signOut: publicProcedure.mutation(({ ctx }) => {
    return ctx.supabase.auth.signOut({
      scope: "global",
    });
  }),
});

export default userRoute;
