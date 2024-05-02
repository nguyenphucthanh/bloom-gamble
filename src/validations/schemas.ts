import { z } from "zod";

export const BiLacSchema: z.ZodType<{
  winner1: string;
  winner2: string;
  loser1: string;
  loser2: string;
}> = z
  .object({
    winner1: z.string().min(1),
    winner2: z.string().min(1),
    loser1: z.string().min(1),
    loser2: z.string().min(1),
  })
  .refine(
    (schema) => {
      const players = new Set([
        schema.winner1,
        schema.winner2,
        schema.loser1,
        schema.loser2,
      ]);
      return players.size === 4;
    },
    {
      message: "Players must be unique",
      path: ["winner1", "winner2", "loser1", "loser2"],
    },
  );
