"use client";
import { FC } from "react";
import { useBetStatus } from "./useBetStatus";

export type BetHeaderProps = {
  id: string;
  teamA: string;
  teamB: string;
};

export const BetHeader: FC<BetHeaderProps> = ({
  id,
  teamA,
  teamB,
}) => {
  const { isFinished, teamAResult, teamBResult } = useBetStatus(id);
  return (
    <div className="flex flex-row items-center gap-4 rounded bg-gradient-to-r from-blue-300 via-white to-red-300 p-4 ring-4 ring-yellow-100">
      <div className="flex-1 text-right text-xl font-bold">{teamA}</div>
      <div>
        {!isFinished ? (
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-destructive text-3xl font-bold text-white">
            VS
          </span>
        ) : (
          <div className="rounded-full bg-destructive p-4 text-xl text-white">
            {teamAResult} - {teamBResult}
          </div>
        )}
      </div>
      <div className="flex-1 text-left text-xl font-bold">{teamB}</div>
    </div>
  );
};
