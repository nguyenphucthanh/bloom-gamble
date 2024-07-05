import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";
import { orderBy, uniq } from "lodash";
import { payback } from "@/lib/payback";

export type PlayerKey = "A" | "B" | "C" | "D";

export type IGambleRound = {
  [key in PlayerKey]: number;
};

export type INullableGambleRound = {
  [key in PlayerKey]: number | null;
};

export type IPlayerRank = {
  [key in PlayerKey]: number;
};

export type IPlayerPoint = {
  [key in PlayerKey]: number;
};

export interface IGambleState {
  gameId: string;
  player: {
    [key in PlayerKey]: string;
  };
  rounds: IGambleRound[];
  ended: boolean;
  slackThread: string | null;
  isGPT: boolean;
  enableSlackNotification: boolean;
}

export type IGamblePlayerArchive = {
  [key in PlayerKey]: {
    winCount: number;
    loseCount: number;
    biggestPoint: number;
    smallestPoint: number;
  };
};

export type PlayerAmount = {
  player: PlayerKey;
  amount: number;
};

const initialState: IGambleState = {
  gameId: "",
  player: {
    A: "",
    B: "",
    C: "",
    D: "",
  },
  rounds: [],
  ended: false,
  slackThread: null,
  isGPT: true,
  enableSlackNotification: true,
};

export const gambleSlice = createSlice({
  name: "gamble",
  initialState,
  reducers: {
    setGameId: (state: IGambleState, action: PayloadAction<string>) => {
      state.gameId = action.payload;
    },
    setPlayer: (
      state: IGambleState,
      action: PayloadAction<IGambleState["player"]>,
    ) => {
      state.player = action.payload;
    },
    newRound: (state: IGambleState, action: PayloadAction<IGambleRound>) => {
      state.rounds.push(action.payload);
    },
    removeRound: (state: IGambleState, action: PayloadAction<number>) => {
      state.rounds.splice(action.payload, 1);
    },
    resetAll: (state: IGambleState) => {
      state.player = initialState.player;
      state.rounds = [];
      state.ended = false;
    },
    endGame: (state: IGambleState) => {
      state.ended = true;
    },
    setSlackThread: (
      state: IGambleState,
      action: PayloadAction<string | null>,
    ) => {
      if (state.enableSlackNotification) {
        state.slackThread = action.payload;
      }
    },
    switchGPT: (state: IGambleState) => {
      state.isGPT = !state.isGPT;
    },
    switchSlackNotification: (
      state: IGambleState,
      action: PayloadAction<boolean>,
    ) => {
      state.enableSlackNotification = action.payload;
    },
  },
});

export const {
  setGameId,
  setPlayer,
  newRound,
  removeRound,
  endGame,
  resetAll,
  setSlackThread,
  switchGPT,
  switchSlackNotification,
} = gambleSlice.actions;

export const selectPlayer = (state: RootState) => state.gamble.player;
export const selectRounds = (state: RootState) => state.gamble.rounds;
export const selectPlayerPoint = (state: RootState) => {
  let A = 0,
    B = 0,
    C = 0,
    D = 0;
  state.gamble.rounds.forEach((round: IGambleRound) => {
    A += round.A;
    B += round.B;
    C += round.C;
    D += round.D;
  });
  return { A, B, C, D } as IPlayerPoint;
};

export const selectPlayerRank = (state: RootState) => {
  const { A, B, C, D } = selectPlayerPoint(state);
  const points = orderBy(uniq([A, B, C, D]), undefined, "desc");
  return {
    A: points.indexOf(A) + 1,
    B: points.indexOf(B) + 1,
    C: points.indexOf(C) + 1,
    D: points.indexOf(D) + 1,
  } as IPlayerRank;
};

export const selectEndGame = (state: RootState) => state.gamble.ended;

export const selectPayback = (
  state: RootState,
): Map<PlayerKey, PlayerAmount[]> => {
  const points = selectPlayerPoint(state);

  const paybackAmounts = payback(points);

  const transaction = new Map<PlayerKey, PlayerAmount[]>();

  paybackAmounts.forEach((value, key) => {
    transaction.set(
      key as PlayerKey,
      value.map((v) => ({ player: v.player as PlayerKey, amount: v.amount })),
    );
  });

  return transaction;
};

export const selectPlayerArchive = (state: RootState) => {
  const rounds = state.gamble.rounds;
  const archive: IGamblePlayerArchive = {
    A: { winCount: 0, loseCount: 0, biggestPoint: 0, smallestPoint: 0 },
    B: { winCount: 0, loseCount: 0, biggestPoint: 0, smallestPoint: 0 },
    C: { winCount: 0, loseCount: 0, biggestPoint: 0, smallestPoint: 0 },
    D: { winCount: 0, loseCount: 0, biggestPoint: 0, smallestPoint: 0 },
  };
  rounds.forEach((round: IGambleRound) => {
    const points = [round.A, round.B, round.C, round.D];
    Object.keys(round).forEach((playerKey: string) => {
      if (round[playerKey as PlayerKey] === Math.max(...points)) {
        archive[playerKey as PlayerKey].winCount++;
      }
      if (round[playerKey as PlayerKey] === Math.min(...points)) {
        archive[playerKey as PlayerKey].loseCount++;
      }
      if (
        round[playerKey as PlayerKey] >
        archive[playerKey as PlayerKey].biggestPoint
      ) {
        archive[playerKey as PlayerKey].biggestPoint =
          round[playerKey as PlayerKey];
      }
      if (
        round[playerKey as PlayerKey] <
        archive[playerKey as PlayerKey].smallestPoint
      ) {
        archive[playerKey as PlayerKey].smallestPoint =
          round[playerKey as PlayerKey];
      }
    });
  });
  return archive;
};

export const selectSlackThread = (state: RootState) => {
  return state.gamble.slackThread;
};

export const selectIsGPT = (state: RootState) => state.gamble.isGPT;

export const selectEnableSlackNotification = (state: RootState) =>
  state.gamble.enableSlackNotification;

export const selectGameId = (state: RootState) => state.gamble.gameId;

export default gambleSlice.reducer;
