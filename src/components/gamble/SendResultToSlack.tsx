import { useAppSelector } from "@/store/hooks";
import { FC, useCallback, useMemo } from "react";
import {
  PlayerAmount,
  PlayerKey,
  selectEnableSlackNotification,
  selectPayback,
  selectPlayer,
  selectPlayerPoint,
} from "./gambleSlice";
import SendMessageToSlack from "../SendMessageToSlack";
import useProfiles from "@/hooks/useUserProfiles";

const SendResultToSlack: FC = () => {
  const total = useAppSelector(selectPlayerPoint);
  const paybacks = useAppSelector(selectPayback);
  const player = useAppSelector(selectPlayer);
  const isNotificationEnabled = useAppSelector(selectEnableSlackNotification);
  const profiles = useProfiles();

  const showName = useCallback(
    (id: string) => {
      return profiles?.find((player) => player.id === id)?.name ?? "Unknown";
    },
    [profiles],
  );

  const message = useMemo(() => {
    const result = Object.entries(total).map(([key, point]) => {
      return `${showName(player[key as PlayerKey])}: ${point}`;
    });
    const paybackResult: string[] = [];

    Array.from(paybacks.keys()).map((key) => {
      return paybacks
        ?.get(key as PlayerKey)
        ?.forEach((payback: PlayerAmount, index: number) =>
          paybackResult.push(
            `${showName(player[payback.player as PlayerKey])} chuyển cho ${showName(
              player[key as PlayerKey],
            )} ${payback.amount}K`,
          ),
        );
    });

    const text = `${result.join(", ")}\n - ${paybackResult.join("\n - ")}`;
    return text;
  }, [paybacks, player, total, showName]);

  if (!isNotificationEnabled) {
    return null;
  }

  return <SendMessageToSlack message={message} />;
};

export default SendResultToSlack;
