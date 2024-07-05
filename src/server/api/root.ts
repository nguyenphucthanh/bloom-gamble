import { createTRPCRouter } from "~/server/api/trpc";
import userRoute from "./routers/user";
import userProfileRoute from "./routers/user-profile";
import gameRoute from "./routers/game";
import userProfilePoints from "./routers/user-profile-points";
import messengerRoute from "./routers/messenger";
import betRoute from "./routers/bet";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRoute,
  userProfile: userProfileRoute,
  game: gameRoute,
  userProfilePoints: userProfilePoints,
  messengerRoute: messengerRoute,
  bet: betRoute,
});

// export type definition of API
export type AppRouter = typeof appRouter;
