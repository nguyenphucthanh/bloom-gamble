import React, { FC, useCallback, useEffect, useMemo } from "react";
import {
  PlayerAmount,
  PlayerKey,
  selectPayback,
  selectPlayer,
  selectPlayerArchive,
  selectPlayerPoint,
  selectRounds,
} from "./gambleSlice";
import { useAppSelector } from "../../store/hooks";
import Image from "next/image";
import styles from "./styles.module.scss";
import { speak } from "@/utils/speech";
import SendResultToSlack from "./SendResultToSlack";
import IconMoney from "../icons/money";
import useProfiles from "@/hooks/useUserProfiles";

const Line: FC<{ nameFrom: string; nameTo: string; amount: number }> = ({
  nameFrom,
  nameTo,
  amount,
}) => {
  const player = useAppSelector(selectPlayer);
  const profiles = useProfiles();

  const showName = (id: string) => {
    return profiles?.find((player) => player.id === id)?.name ?? "Unknown";
  }

  return (
    <li className="flex gap-2">
      <IconMoney />
      <span>
        {showName(player[nameFrom as PlayerKey])} chuyển cho{" "}
        {showName(player[nameTo as PlayerKey])}{" "}
        <span className="font-bold text-red-500">{amount}K</span>
      </span>
    </li>
  );
};

const Summary: FC = () => {
  const paybacks = useAppSelector(selectPayback);
  const playerPoints = useAppSelector(selectPlayerPoint);
  const player = useAppSelector(selectPlayer);
  const archive = useAppSelector(selectPlayerArchive);
  const total = useAppSelector(selectPlayerPoint);
  const rounds = useAppSelector(selectRounds);
  const profiles = useProfiles();

  const showName = useCallback((id: string) => {
    return profiles?.find((player) => player.id === id)?.name ?? "Unknown";
  }, [profiles]);

  const winnerAndLoser = useMemo(() => {
    const winnerKey = Object.keys(playerPoints).filter(
      (key) => playerPoints[key as PlayerKey] > 0,
    );
    const loserKeys = Object.keys(playerPoints).filter(
      (key) => playerPoints[key as PlayerKey] < 0,
    );
    return { winnerKey, loserKeys };
  }, [playerPoints]);

  useEffect(() => {
    if (winnerAndLoser.winnerKey && winnerAndLoser.loserKeys) {
      const winners = winnerAndLoser.winnerKey
        ?.map((key) => showName(player[key as PlayerKey]))
        .join(", ");
      const losers = winnerAndLoser.loserKeys
        ?.map((key) => showName(player[key as PlayerKey]))
        .join(", ");

      speak(
        `Chúc mừng ${winners} đã chiến thắng trận bài hôm nay. ${losers} hôm sau nhớ cúng trước khi chơi nhé!`,
      );
    }
  }, [winnerAndLoser, player, showName]);


  return (
    <div className="shadow-blue-300s mt-5 rounded border border-blue-300 p-3 shadow-lg">
      <h3 className="mb-3 text-2xl font-bold">
        Tổng kết sau {rounds.length} ván
      </h3>
      <ul className="ml-3 flex flex-col gap-2 text-left">
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
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="flex flex-col items-center gap-2">
          <Image
            src={"/winner.jpg"}
            alt="Winner"
            className="rounded-full"
            width={120}
            height={120}
          />
          <h3 className="text-center font-bold">🏆 Winner 🏆</h3>
          <h4 className="w-full rounded-full bg-red-500 p-3 text-center text-2xl font-bold text-white">
            {winnerAndLoser.winnerKey
              ?.map((key) => showName(player[key as PlayerKey]))
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
          <h3 className="text-center font-bold">😭 Loser 😭 </h3>
          <h4 className="w-full rounded-full bg-black p-3 text-center text-2xl font-bold text-white">
            {winnerAndLoser.loserKeys
              ?.map((key) => showName(player[key as PlayerKey]))
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
              <td className="font-bold">{showName(player[playerKey as PlayerKey])}</td>
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
