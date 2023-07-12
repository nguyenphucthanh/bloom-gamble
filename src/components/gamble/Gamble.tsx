import React, { FC } from "react";
import Table from "./Table";
import { useAppSelector } from "../../store/hooks";
import { selectEndGame } from "./gambleSlice";
import Summary from "./Summary";
import GameController from "./GameController";

const Gamble: FC = () => {
  const isGameEnded = useAppSelector(selectEndGame);
  return (
    <>
      <Table />
      <GameController />
      {isGameEnded ? <Summary /> : null}
    </>
  );
};

export default Gamble;
