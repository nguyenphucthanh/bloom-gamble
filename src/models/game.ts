import { GAME_TYPE } from "@/consts";

export type QuickUserGamePoint = {
  gameId?: string;
  gameType?: string | GAME_TYPE;
  gameDate?: string;
  point: number;
  name?: string;
};
