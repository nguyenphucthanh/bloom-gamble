import { FC } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { CrownIcon, FrownIcon, LaughIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type BetResultProps = {
  players: {
    id: string;
    name: string;
    betAmount: number;
    team: string;
  }[];
  winTeam: "A" | "B";
};

export const BetResult: FC<BetResultProps> = ({ players, winTeam }) => {
  const winners = players.filter((player) => player.team === winTeam);
  const losers = players.filter((player) => player.team !== winTeam);
  const sumOfWinner = winners.reduce((acc, curr) => acc + curr.betAmount, 0);
  const sumOfLoser = losers.reduce((acc, curr) => acc + curr.betAmount, 0);
  const winnersWithIncome = winners.map((winner) => {
    const rate = winner.betAmount / sumOfWinner;

    return {
      ...winner,
      income: sumOfLoser * rate,
    };
  });

  return (
    <Card className="mt-5">
      <CardHeader>
        <CardTitle className="flex flex-row items-center justify-center gap-2 text-center text-3xl text-red-500">
          <CrownIcon />
          Kết quả
          <CrownIcon />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <h4 className="text-xl font-bold">
          <FrownIcon className="mr-2 inline-block w-10" />
          Losers
        </h4>
        <ul className="list my-4 ml-12 list-none">
          {losers.map((loser) => (
            <li key={loser.id}>
              {loser.name} {formatCurrency(-loser.betAmount)}
            </li>
          ))}
        </ul>
        <h4 className="text-xl font-bold">
          <LaughIcon className="mr-2 inline-block w-10" />
          Winners
        </h4>
        <ul className="list my-4 ml-12 list-none">
          {winnersWithIncome.map((winner) => (
            <li key={winner.id}>
              {winner.name}: +{formatCurrency(Math.floor(winner.income))}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
