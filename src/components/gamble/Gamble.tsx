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
        className={`inline-flex gap-2  ring  rounded-full  p-3 fixed z-30 left-4 bottom-4 bg-white bg-opacity-50 backdrop-blur-md ${
          isGPT
            ? "border-blue-500 ring-blue-100 text-blue-400"
            : "border-red-500 ring-red-100 text-red-400"
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
