import React, { FC, useCallback, useEffect, useMemo } from "react";
import {
  PlayerKey,
  selectEnableSlackNotification,
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
import SendResultToSlack from "@/components/SendResultToSlack";
import useProfiles from "@/hooks/useUserProfiles";
import PaybackBoard from "@/components/PaybackBoard";
import { InputPoint, Payback } from "@/lib/payback";

const Summary: FC = () => {
  const paybacks = useAppSelector(selectPayback);
  const playerPoints = useAppSelector(selectPlayerPoint);
  const player = useAppSelector(selectPlayer);
  const archive = useAppSelector(selectPlayerArchive);
  const total = useAppSelector(selectPlayerPoint);
  const rounds = useAppSelector(selectRounds);
  const profiles = useProfiles();
  const isEnabledNotification = useAppSelector(selectEnableSlackNotification);

  const showName = useCallback(
    (id: string) => {
      return profiles?.find((player) => player.id === id)?.name ?? "Unknown";
    },
    [profiles],
  );

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

  const namedPaybacks = useMemo(() => {
    const newPaybacks: Payback = new Map();
    paybacks.forEach((value, playerKey) => {
      newPaybacks.set(
        showName(player[playerKey]),
        value.map((v) => ({
          player: showName(player[v.player]),
          amount: v.amount,
        })),
      );
    });
    return newPaybacks;
  }, [paybacks, showName, player]);

  const namedTotals = useMemo(() => {
    const board: InputPoint = {};
    Object.keys(total).forEach((key) => {
      board[showName(player[key as PlayerKey])] = total[key as PlayerKey];
    });
    return board;
  }, [player, showName, total]);

  return (
    <div className="shadow-blue-300s mt-5 rounded border border-blue-300 p-3 shadow-lg">
      <h3 className="mb-3 text-2xl font-bold">
        Tổng kết sau {rounds.length} ván
      </h3>
      <PaybackBoard paybacks={namedPaybacks} />
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
              <td className="font-bold">
                {showName(player[playerKey as PlayerKey])}
              </td>
              <td className="font-bold">{total[playerKey as PlayerKey]}</td>
              <td>{archive[playerKey as PlayerKey].winCount}</td>
              <td>{archive[playerKey as PlayerKey].loseCount}</td>
              <td>{archive[playerKey as PlayerKey].biggestPoint}</td>
              <td>{archive[playerKey as PlayerKey].smallestPoint}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {isEnabledNotification && (
        <SendResultToSlack
          className="mt-5 w-full"
          playerPoints={namedTotals}
          paybacks={namedPaybacks}
        />
      )}
    </div>
  );
};

export default Summary;
