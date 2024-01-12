import { useAppSelector } from "@/store/hooks";
import { FC, useCallback } from "react";
import {
  PlayerAmount,
  PlayerKey,
  selectEnableSlackNotification,
  selectPayback,
  selectPlayer,
  selectPlayerPoint,
} from "./gambleSlice";
import axios from "axios";

const SendResultToSlack: FC = () => {
  const total = useAppSelector(selectPlayerPoint);
  const paybacks = useAppSelector(selectPayback);
  const player = useAppSelector(selectPlayer);
  const isNotificationEnabled = useAppSelector(selectEnableSlackNotification);

  const sendResult = useCallback(() => {
    const result = Object.entries(total).map(([key, point]) => {
      return `${player[key as PlayerKey]}: ${point}`;
    });
    const paybackResult: string[] = [];

    Array.from(paybacks.keys()).map((key) => {
      return paybacks
        ?.get(key as PlayerKey)
        ?.forEach((payback: PlayerAmount, index: number) =>
          paybackResult.push(
            `${player[payback.player as PlayerKey] ?? ""} chuyển cho ${
              player[key as PlayerKey] ?? ""
            } ${payback.amount}K`
          )
        );
    });

    const text = `${result.join(", ")}\n - ${paybackResult.join("\n - ")}`;
    axios.post("/api/slack", {
      text,
    });
  }, [paybacks, player, total]);

  if (!isNotificationEnabled) {
    return null;
  }

  return (
    <button
      className="font-bold bg-blue-500 text-white rounded p-3 mt-5 text-center justify-center inline-flex gap-2 w-full col-span-2"
      onClick={sendResult}
    >
      Post Result To Slack
    </button>
  );
};

export default SendResultToSlack;
