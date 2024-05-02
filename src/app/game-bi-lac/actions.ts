"use server";
import { GAME_TYPE } from "@/consts";
import { api } from "@/trpc/server";
import { BiLacSchema } from "@/validations/schemas";
import * as z from "zod";
import { zfd } from "zod-form-data";

export type CreateState =
  | {
      state: "success";
      message: string;
    }
  | {
      state: "error";
      message: string;
      errors?: {
        path: string;
        message: string;
      }[];
    }
  | null;

export const createGameBiLac = async (
  prevState: CreateState | null,
  data: FormData,
): Promise<CreateState> => {
  try {
    const CreateFormDataSchema = zfd.formData(BiLacSchema);
    const { winner1, winner2, loser1, loser2 } =
      CreateFormDataSchema.parse(data);

    const response = await api.game.createGame.mutate({
      gameType: GAME_TYPE.BI_LAC,
    });
    await api.game.endGame.mutate({
      id: response.game.id,
      players: [
        { userProfile_id: winner1, points: 10 },
        { userProfile_id: winner2, points: 10 },
        { userProfile_id: loser1, points: -10 },
        { userProfile_id: loser2, points: -10 },
      ],
    });

    return {
      ...prevState,
      state: "success",
      message: "Game created",
    };
  } catch (ex) {
    const msg = ex instanceof Error ? ex.message : "Failed to create game";
    const errors =
      ex instanceof z.ZodError
        ? ex.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          }))
        : undefined;
    return {
      state: "error",
      message: msg,
      errors,
    };
  }
};
