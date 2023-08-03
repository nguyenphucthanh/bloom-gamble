import React, { FC } from "react";
import Table from "./Table";
import { useAppSelector } from "../../store/hooks";
import { selectEndGame } from "./gambleSlice";
import Summary from "./Summary";
import GameController from "./GameController";
import LiveStat from "./LiveStat";

const Gamble: FC = () => {
  const isGameEnded = useAppSelector(selectEndGame);
  return (
    <div className="pb-64">
      <Table />
      <GameController />
      {isGameEnded ? <Summary /> : <LiveStat />}
    </div>
  );
};

export default Gamble;
