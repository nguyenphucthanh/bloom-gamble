import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";
import { orderBy, uniq } from "lodash";

export type PlayerKey = "A" | "B" | "C" | "D";

export type IGambleRound = {
  [key in PlayerKey]: number;
};

export type IPlayerRank = {
  [key in PlayerKey]: number;
};

export type IPlayerPoint = {
  [key in PlayerKey]: number;
};

export interface IGambleState {
  player: {
    [key in PlayerKey]: string;
  };
  rounds: IGambleRound[];
  ended: boolean;
}

export type IGamblePlayerArchive = {
  [key in PlayerKey]: {
    winCount: number;
    loseCount: number;
    biggestPoint: number;
    smallestPoint: number;
  };
};

const initialState: IGambleState = {
  player: {
    A: "",
    B: "",
    C: "",
    D: "",
  },
  rounds: [],
  ended: false,
};

export const gambleSlice = createSlice({
  name: "gamble",
  initialState,
  reducers: {
    setPlayer: (
      state: IGambleState,
      action: PayloadAction<IGambleState["player"]>
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
  },
});

export const { setPlayer, newRound, removeRound, endGame, resetAll } =
  gambleSlice.actions;

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

export const selectPayback = (state: RootState) => {
  type PlayerAmount = {
    player: PlayerKey;
    amount: number;
  };

  const paybackAmounts = new Map<PlayerKey, PlayerAmount[]>();

  const creditors: PlayerAmount[] = [];

  const debtors: PlayerAmount[] = [];

  const points = selectPlayerPoint(state);

  Object.keys(state.gamble.player).forEach((key: string) => {
    const point = points[key as PlayerKey];
    if (point > 0) {
      creditors.push({
        player: key as PlayerKey,
        amount: point,
      } as PlayerAmount);
    } else {
      debtors.push({
        player: key as PlayerKey,
        amount: Math.abs(point),
      } as PlayerAmount);
    }
  });

  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => a.amount - b.amount);

  while (creditors.length && debtors.length) {
    const creditor = creditors[0];
    const debtor = debtors[0];

    const amount = Math.min(debtor.amount, creditor.amount);
    const paybackAmount: PlayerAmount = { player: debtor.player, amount };

    if (!paybackAmounts.has(creditor.player)) {
      paybackAmounts.set(creditor.player, []);
    }

    const entry = paybackAmounts.get(creditor.player);
    if (entry) {
      entry?.push(paybackAmount);
      paybackAmounts.set(creditor.player, entry);
    }

    debtor.amount -= amount;
    creditor.amount -= amount;

    if (debtor.amount === 0) {
      debtors.shift();
    }
    if (creditor.amount === 0) {
      creditors.shift();
    }
  }

  console.log(paybackAmounts);

  return paybackAmounts;
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

export default gambleSlice.reducer;
