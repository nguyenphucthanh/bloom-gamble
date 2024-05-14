import { GAME_TYPE } from "@/consts";
import { api } from "@/trpc/server";
import React from "react";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
} from "../ui/table";
import { FrownIcon, SmileIcon } from "lucide-react";
import FoosballGamesListItem, {
  FoosballGameInfo,
} from "../foosball-games-list-item";

export type GamesList = {
  dateFrom: string;
  dateTo: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default async function FoosballGamesList({
  dateFrom,
  dateTo,
  ...props
}: GamesList) {
  const games = await api.game.gamesByType.query({
    dateFrom,
    dateTo,
    gameType: GAME_TYPE.BI_LAC,
  });

  const arrangedGames: FoosballGameInfo[] = games.reduce(
    (acc: FoosballGameInfo[], game) => {
      const winners = game.UserProfilePoint.filter((u) => u.points > 0);
      const losers = game.UserProfilePoint.filter((u) => u.points < 0);
      const next: FoosballGameInfo = {
        id: game.id,
        winner1:
          winners?.[0]?.UserProfile?.name ??
          winners?.[0]?.UserProfile?.firstName ??
          "",
        winner2:
          winners?.[1]?.UserProfile?.name ??
          winners?.[1]?.UserProfile?.firstName ??
          "",
        loser1:
          losers?.[0]?.UserProfile?.name ??
          losers?.[0]?.UserProfile?.firstName ??
          "",
        loser2:
          losers?.[1]?.UserProfile?.name ??
          losers?.[1]?.UserProfile?.firstName ??
          "",
      };

      return [...acc, next];
    },
    [],
  );

  return (
    <div {...props}>
      <h3 className="text-xl font-bold">{arrangedGames.length} Lượt đấu</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead colSpan={2}>
              <div className="inline-flex gap-2 text-blue-500">
                <SmileIcon /> Winners
              </div>
            </TableHead>
            <TableHead colSpan={2}>
              <div className="inline-flex gap-2 text-red-500">
                <FrownIcon /> Losers
              </div>
            </TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {arrangedGames.map((game) => (
            <FoosballGamesListItem key={game.id} game={game} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
