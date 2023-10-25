import React, {
  FC,
  FormEventHandler,
  useCallback,
  useMemo,
  useState,
} from "react";
import styles from "./styles.module.scss";
import { useAppDispatch } from "../../store/hooks";
import { IGambleState, setPlayer, setSlackThread } from "./gambleSlice";
import PlayerNameInput from "./PlayerNameInput";
import axios from "axios";

export const EnterPlayer: FC = () => {
  const dispatch = useAppDispatch();
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
      const slackMessage = await axios.post("/api/slack", {
        text: `[LIVE STREAM]: ${Object.values(names).join(
          ", "
        )} đã bắt đầu trò chơi!`,
      });
      const ts = slackMessage.data.response.ts;
      dispatch(setSlackThread(ts));
    },
    [dispatch, names]
  );

  const isAbleToSubmit = useMemo(() => {
    return names.A && names.B && names.C && names.D;
  }, [names]);

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
          <p>
            <a href="https://giphy.com/gifs/pokemon-anime-cheer-meowth-uzWoRrlxnbL6TJgIbP">
              via GIPHY
            </a>
          </p>
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
