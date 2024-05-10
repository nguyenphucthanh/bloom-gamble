import { GAME_TYPE, GAME_TITLE } from "@/consts";
import { api } from "@/trpc/server";
import React from "react";
import StatCard from "@/components/StatCard";
import UserGameStatChart from "@/components/UserGameStatChart";
import { QuickUserGamePoint } from "@/models/game";

export type PointsByUserProps = {
  emailOrId: string;
};

type GamePoint = Record<string, { point: number; count: number }>;

export default async function PointsByUser({ emailOrId }: PointsByUserProps) {
  const points = await api.userProfilePoints.reportByUser.query(emailOrId);

  // sum and group by points.gameType
  const grouped: GamePoint = points.reduce((acc: GamePoint, point) => {
    const key = point.gameType;
    if (!acc[key]) {
      acc[key] = {
        point: 0,
        count: 0,
      };
    }

    acc[key].point += point.point;
    acc[key].count += 1;
    return acc;
  }, {});

  const tienLenRecords: QuickUserGamePoint[] = points
    .filter(
      (p) =>
        p.gameType.toString().toLowerCase() ===
        GAME_TYPE.TIEN_LEN.toString().toLowerCase(),
    )
    .map((item) => {
      const next: QuickUserGamePoint = {
        gameId: item.gameId,
        gameType: item.gameType as GAME_TYPE,
        gameDate: item.gameDate,
        point: item.point,
      };
      return next;
    });

  const biLacRecords: QuickUserGamePoint[] = points
    .filter(
      (p) =>
        p.gameType.toString().toLowerCase() ===
        GAME_TYPE.BI_LAC.toString().toLowerCase(),
    )
    .map((item) => {
      const next: QuickUserGamePoint = {
        gameId: item.gameId,
        gameType: item.gameType as GAME_TYPE,
        gameDate: item.gameDate,
        point: item.point,
      };
      return next;
    });

  return (
    <div className="mt-5">
      <h3 className="text-xl font-bold">Points</h3>
      <div className="mt-3 grid grid-cols-2 gap-6">
        <StatCard
          title={GAME_TITLE[GAME_TYPE.TIEN_LEN]}
          value={grouped[GAME_TYPE.TIEN_LEN]?.point ?? 0}
          description={<p>{grouped[GAME_TYPE.TIEN_LEN]?.count ?? 0} games</p>}
        />
        <StatCard
          title={GAME_TITLE[GAME_TYPE.BI_LAC]}
          value={grouped[GAME_TYPE.BI_LAC]?.point ?? 0}
          description={<p>{grouped[GAME_TYPE.BI_LAC]?.count ?? 0} games</p>}
        />
      </div>

      <hr className="my-8 border-slate-300" />
      <h3 className="text-xl font-bold">{GAME_TITLE[GAME_TYPE.TIEN_LEN]}</h3>
      <div>
        <UserGameStatChart records={tienLenRecords} />
      </div>

      <hr className="my-8 border-slate-300" />
      <h3 className="text-xl font-bold">{GAME_TITLE[GAME_TYPE.BI_LAC]}</h3>
      <div>
        <UserGameStatChart records={biLacRecords} />
      </div>
    </div>
  );
}
