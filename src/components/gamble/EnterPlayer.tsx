import React, {
  FC,
  FormEventHandler,
  useCallback,
  useMemo,
  useState,
} from "react";
import styles from "./styles.module.scss";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { IGambleState, selectEnableSlackNotification, setPlayer, setSlackThread, switchSlackNotification } from "./gambleSlice";
import PlayerNameInput from "./PlayerNameInput";
import axios from "axios";

export const EnterPlayer: FC = () => {
  const dispatch = useAppDispatch();
  const isNotificationEnabled = useAppSelector(selectEnableSlackNotification)
  const [names, setNames] = useState<{
    [key: string]: string;
  }>({
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

  const startGame = useCallback<FormEventHandler<HTMLFormElement>>(
    async (event) => {
      event.preventDefault();
      dispatch(setPlayer(names as IGambleState["player"]));
      if (isNotificationEnabled) {
        const slackMessage = await axios.post("/api/slack", {
          text: `[LIVE STREAM]: ${Object.values(names).join(
            ", "
          )} đã bắt đầu trò chơi!`,
        });
        const ts = slackMessage.data.response.ts;
        dispatch(setSlackThread(ts));
      }
    },
    [dispatch, isNotificationEnabled, names]
  );

  const isAbleToSubmit = useMemo(() => {
    return names.A && names.B && names.C && names.D;
  }, [names]);


  const toggleNotification = useCallback(() => {
    dispatch(switchSlackNotification())
  }, [dispatch])

  return (
    <form className="mt-4" onSubmit={startGame}>
      <h1 className="text-2xl font-bold my-2">Nhập tên người chơi</h1>
      <div className="flex flex-col gap-2 items-center">
        {Object.keys(names).map((id: string) => (
          <div key={id}>
            <PlayerNameInput
              value={names?.[id] ?? ""}
              onChange={(value: string) => {
                setPlayerName(id, value);
              }}
              placeholder={`Player ${id}`}
              className={styles.inputPlayer}
            />
          </div>
        ))}
        <div className="flex flex-col items-center gap-2">
          <div className="text-center text-red-500 font-bold text-lg">
            Chúc các bạn may mắn
          </div>
        </div>
        <div className="p-2">
          <label className="flex flex-row item-center gap-2">
            <input type="checkbox" checked={isNotificationEnabled} onChange={toggleNotification} className="accent-blue-500 w-6 h-6" />
            <span className="block">
              Gửi thông báo đến Slack
            </span>
          </label>
        </div>
        <button
          type="submit"
          className="text-white font-bold text-3xl bg-blue-500 rounded-lg p-2 text-center w-1/2 disabled:opacity-50"
          disabled={!isAbleToSubmit}
        >
          DZÔ!
        </button>
      </div>
    </form>
  );
};
