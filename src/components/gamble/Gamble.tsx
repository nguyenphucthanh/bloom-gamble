import React, { FC } from "react";
import Table from "./Table";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectEndGame, selectIsGPT, switchGPT } from "./gambleSlice";
import Summary from "./Summary";
import GameController from "./GameController";
import LiveStat from "./LiveStat";

const Gamble: FC = () => {
  const isGameEnded = useAppSelector(selectEndGame);
  const isGPT = useAppSelector(selectIsGPT);
  const dispatch = useAppDispatch();
  return (
    <div className="pb-64">
      <Table />
      <GameController />
      <button
        className={`fixed bottom-4 left-4 z-30 inline-flex gap-2 rounded-full bg-white bg-opacity-50 p-3 ring backdrop-blur-md ${
          isGPT
            ? "border-blue-500 text-blue-400 ring-blue-100"
            : "border-red-500 text-red-400 ring-red-100"
        }`}
        onClick={() => dispatch(switchGPT())}
      >
        <span>{isGPT ? "📢" : "🔇"}</span>
        <span>ChửiGPT</span>
      </button>
      {isGameEnded ? <Summary /> : <LiveStat />}
    </div>
  );
};

export default Gamble;
