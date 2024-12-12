import { InputPoint, payback } from "@/lib/payback";
import { RootState } from "@/store/store";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type IFreeBoardMember = {
  profileId: string;
  point?: number;
};

export type IFreeBoardState = {
  members: IFreeBoardMember[];
};

const initialState: IFreeBoardState = {
  members: [],
};

export const freeBoardSlice = createSlice({
  name: "freeBoard",
  initialState,
  reducers: {
    increase: (
      state: IFreeBoardState,
      action: PayloadAction<IFreeBoardMember>,
    ) => {
      const found = state.members.find(
        (member) => member.profileId === action.payload.profileId,
      );
      if (found) {
        if (!found.point) {
          found.point = 0;
        }
        found.point += 1;
      } else {
        state.members.push({
          profileId: action.payload.profileId,
          point: 1,
        });
      }
    },
    decrease: (
      state: IFreeBoardState,
      action: PayloadAction<IFreeBoardMember>,
    ) => {
      const found = state.members.find(
        (member) => member.profileId === action.payload.profileId,
      );
      if (found) {
        if (!found.point) {
          found.point = 0;
        }
        found.point -= 1;
      } else {
        state.members.push({
          profileId: action.payload.profileId,
          point: -1,
        });
      }
    },
    resetBoard: (state: IFreeBoardState) => {
      state.members = [];
    },
  },
});

export const { increase, decrease, resetBoard } = freeBoardSlice.actions;

export const selectPointByProfileId =
  (state: RootState) => (profileId: string) =>
    state.freeBoard.members.find((member) => member.profileId === profileId)
      ?.point;

export const selectFreeBoardPoints = (state: RootState) => {
  const records: InputPoint = {};
  state.freeBoard.members.forEach((member) => {
    if (member.point) {
      records[member.profileId] = member.point;
    }
  });
  return records;
};

export const selectFreeBoardPayback = (state: RootState) => {
  const records = selectFreeBoardPoints(state);
  return payback(records);
};

export const selectFreeBoardValidity = (state: RootState) => {
  const total = state.freeBoard.members.reduce(
    (acc, cur) => acc + (cur.point ?? 0),
    0,
  );

  return total === 0;
};

export default freeBoardSlice.reducer;
