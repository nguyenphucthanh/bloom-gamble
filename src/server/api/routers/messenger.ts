import SlackMessage from "@/app/services/slack-message";
import { createTRPCRouter, publicProcedure } from "../trpc";
import * as z from "zod";
const messengerRoute = createTRPCRouter({
  send: publicProcedure
    .input(
      z.object({
        message: z.string(),
        threadId: z.string().optional(),
      }),
    )
    .mutation(({ input }) => {
      const messageService = new SlackMessage();
      const message = input.message;
      const threadId = input.threadId;
      return messageService.send(message, threadId);
    }),
});

export default messengerRoute;
