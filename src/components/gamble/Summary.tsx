import React, { FC, useEffect, useMemo } from "react";
import {
  PlayerAmount,
  PlayerKey,
  selectEnableSlackNotification,
  selectPayback,
  selectPlayer,
  selectPlayerArchive,
  selectPlayerPoint,
  selectPlayerRank,
  selectRounds,
} from "./gambleSlice";
import { useAppSelector } from "../../store/hooks";
import Image from "next/image";
import styles from "./styles.module.scss";
import { speak } from "@/app/utils/speech";
import SendResultToSlack from "./SendResultToSlack";
import IconMoney from "../icons/money";

const Line: FC<{ nameFrom: string; nameTo: string; amount: number }> = ({
  nameFrom,
  nameTo,
  amount,
}) => {
  const player = useAppSelector(selectPlayer);

  return (
    <li className="flex gap-2">
      <IconMoney />
      <span>
        {player[nameFrom as PlayerKey] ?? ""} chuyển cho{" "}
        {player[nameTo as PlayerKey] ?? ""}{" "}
        <span className="text-red-500 font-bold">{amount}K</span>
      </span>
    </li>
  );
};

const Summary: FC = () => {
  const paybacks = useAppSelector(selectPayback);
  const playerRanks = useAppSelector(selectPlayerRank);
  const playerPoints = useAppSelector(selectPlayerPoint);
  const player = useAppSelector(selectPlayer);
  const archive = useAppSelector(selectPlayerArchive);
  const total = useAppSelector(selectPlayerPoint);
  const rounds = useAppSelector(selectRounds);

  const winnerAndLoser = useMemo(() => {
    // const ranks = [playerRanks.A, playerRanks.B, playerRanks.C, playerRanks.D];
    // const min = Math.min(...ranks);
    // const max = Math.max(...ranks);
    const winnerKey = Object.keys(playerPoints).filter(
      (key) => playerPoints[key as PlayerKey] > 0
    );
    const loserKeys = Object.keys(playerPoints).filter(
      (key) => playerPoints[key as PlayerKey] < 0
    );
    return { winnerKey, loserKeys };
  }, [playerPoints]);

  useEffect(() => {
    if (winnerAndLoser.winnerKey && winnerAndLoser.loserKeys) {
      const winners = winnerAndLoser.winnerKey
        ?.map((key) => player[key as PlayerKey])
        .join(", ");
      const losers = winnerAndLoser.loserKeys
        ?.map((key) => player[key as PlayerKey])
        .join(", ");

      speak(
        `Chúc mừng ${winners} đã chiến thắng trận bài hôm nay. ${losers} hôm sau nhớ cúng trước khi chơi nhé!`
      );
    }
  }, [winnerAndLoser, player]);

  return (
    <div className="p-3 border border-blue-300 shadow-lg shadow-blue-300s mt-5 rounded">
      <h3 className="font-bold text-2xl mb-3">
        Tổng kết sau {rounds.length} ván
      </h3>
      <ul className="text-left ml-3 flex flex-col gap-2">
        {Array.from(paybacks.keys()).map((key) => {
          return paybacks
            ?.get(key as PlayerKey)
            ?.map((payback: PlayerAmount, index: number) => (
              <Line
                key={`${key}-${index}`}
                nameTo={key as string}
                nameFrom={payback.player}
                amount={payback.amount}
              />
            ));
        })}
      </ul>
      <div className="grid grid-cols-2 gap-2 mt-4">
        <div className="flex flex-col items-center gap-2">
          <Image
            src={"/winner.jpg"}
            alt="Winner"
            className="rounded-full"
            width={120}
            height={120}
          />
          <h3 className="font-bold text-center">🏆 Winner 🏆</h3>
          <h4 className="font-bold text-center text-2xl rounded-full bg-red-500 text-white p-3 w-full">
            {winnerAndLoser.winnerKey
              ?.map((key) => player[key as PlayerKey])
              .join(", ")}
          </h4>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Image
            src={"/loser.jpg"}
            alt="Loser"
            className="rounded-full"
            width={120}
            height={120}
          />
          <h3 className="font-bold text-center">😭 Loser 😭 </h3>
          <h4 className="font-bold text-center text-2xl rounded-full bg-black text-white p-3 w-full">
            {winnerAndLoser.loserKeys
              ?.map((key) => player[key as PlayerKey])
              .join(", ")}
          </h4>
        </div>
      </div>
      <table className={`${styles.table} text-sm`}>
        <thead>
          <tr>
            <th>Player</th>
            <th>Điểm</th>
            <th># Nhất</th>
            <th># Bét</th>
            <th>Thắng đậm nhất</th>
            <th>Thua đậm nhất</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(archive).map((playerKey) => (
            <tr key={playerKey}>
              <td className="font-bold">{player[playerKey as PlayerKey]}</td>
              <td className="font-bold">{total[playerKey as PlayerKey]}</td>
              <td>{archive[playerKey as PlayerKey].winCount}</td>
              <td>{archive[playerKey as PlayerKey].loseCount}</td>
              <td>{archive[playerKey as PlayerKey].biggestPoint}</td>
              <td>{archive[playerKey as PlayerKey].smallestPoint}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <SendResultToSlack />
    </div>
  );
};

export default Summary;
