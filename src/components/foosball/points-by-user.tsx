import { GAME_TYPE, GAME_TITLE } from "@/consts";
import { api } from "@/trpc/server";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../ui/card";

export type PointsByUserProps = {
  emailOrId: string;
};

type GamePoint = {
  [key: string]: {
    point: number;
    count: number;
  };
};

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

  return (
    <div className="mt-5">
      <h3 className="text-xl font-bold">Points</h3>
      <div className="mt-3 grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardDescription>{GAME_TITLE[GAME_TYPE.TIEN_LEN]}</CardDescription>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-3xl">
              {grouped[GAME_TYPE.TIEN_LEN]?.point ?? 0}
            </CardTitle>
          </CardContent>
          <CardFooter>
            <p>{grouped[GAME_TYPE.TIEN_LEN]?.count ?? 0} games</p>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>{GAME_TITLE[GAME_TYPE.BI_LAC]}</CardDescription>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-3xl">
              {grouped[GAME_TYPE.BI_LAC]?.point ?? 0}
            </CardTitle>
          </CardContent>
          <CardFooter>
            <p>{grouped[GAME_TYPE.BI_LAC]?.count ?? 0} games</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
