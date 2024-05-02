import React, {
  FC,
  FormEventHandler,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  IGambleState,
  selectEnableSlackNotification,
  setGameId,
  setPlayer,
  setSlackThread,
  switchSlackNotification,
} from "./gambleSlice";
import PlayerNameInput from "./PlayerNameInput";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { api } from "@/trpc/react";
import { GAME_TYPE } from "@/consts";
import { useToast } from "../ui/use-toast";
import useMessenger from "@/hooks/useMessenger";
import useProfiles from "@/hooks/useUserProfiles";

export const EnterPlayer: FC = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const isNotificationEnabled = useAppSelector(selectEnableSlackNotification);
  const [names, setNames] = useState<Record<string, string>>({
    A: "",
    B: "",
    C: "",
    D: "",
  });

  const setPlayerName = useCallback((id: string, name: string) => {
    setNames((prev) => ({
      ...prev,
      [id]: name,
    }));
  }, []);

  const startGameMutation = api.game.createGame.useMutation();
  const profiles = useProfiles();
  const { sendMessage } = useMessenger();

  const startGame = useCallback<FormEventHandler<HTMLFormElement>>(
    async (event) => {
      event.preventDefault();
      try {
        const response = await startGameMutation.mutateAsync({
          gameType: GAME_TYPE.TIEN_LEN,
        });
        dispatch(setGameId(response.game?.id));
        dispatch(setPlayer(names as IGambleState["player"]));
        if (isNotificationEnabled) {
          const msg = `[LIVE STREAM]: ${Object.values(names)
            .map((id) => {
              const player = profiles?.find((profile) => profile.id === id);
              return player?.name ?? id;
            })
            .join(", ")} đã bắt đầu trò chơi!`;
          const slackMessage = await sendMessage(msg);
          const ts = slackMessage.response.ts;
          dispatch(setSlackThread(ts));
        }
      } catch (ex) {
        const msg = ex instanceof Error ? ex.message : "Failed to start game";
        toast({
          title: "Error",
          description: msg,
        });
      }
    },
    [
      dispatch,
      isNotificationEnabled,
      names,
      startGameMutation,
      toast,
      sendMessage,
      profiles,
    ],
  );

  const isAbleToSubmit = useMemo(() => {
    return (
      names.A &&
      names.B &&
      names.C &&
      names.D &&
      new Set([names.A, names.B, names.C, names.D]).size === 4
    );
  }, [names]);

  const toggleNotification = useCallback(
    (checked: boolean) => {
      dispatch(switchSlackNotification(checked));
    },
    [dispatch],
  );

  return (
    <form className="mt-4" onSubmit={startGame}>
      <h1 className="my-2 text-2xl font-bold">Nhập tên người chơi</h1>
      <div className="flex flex-col items-center gap-2">
        {Object.keys(names).map((id: string) => (
          <div key={id}>
            <PlayerNameInput
              value={names?.[id] ?? ""}
              onChange={(value: string) => {
                setPlayerName(id, value);
              }}
              placeholder={`Player ${id}`}
            />
          </div>
        ))}
        <div className="flex flex-col items-center gap-2">
          <div className="text-center text-lg font-bold text-red-500">
            Chúc các bạn may mắn
          </div>
        </div>
        <div className="p-2">
          <label className="item-top flex space-x-2">
            <Checkbox
              id="noti"
              checked={isNotificationEnabled}
              onCheckedChange={toggleNotification}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="noti"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Gửi thông báo đến slack
              </label>
            </div>
          </label>
        </div>
        <Button
          type="submit"
          disabled={!isAbleToSubmit}
          size={"lg"}
          className="bg-blue-500"
        >
          DZÔ!
        </Button>
      </div>
    </form>
  );
};
