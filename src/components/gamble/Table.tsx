import React, { FC, useCallback } from "react";
import { useAppSelector } from "../../store/hooks";
import {
  IGambleRound,
  selectEndGame,
  selectPlayer,
  selectPlayerPoint,
  selectPlayerRank,
  selectRounds,
} from "./gambleSlice";
import styles from "./styles.module.scss";
import AddRow from "./AddRound";
import TableRound from "./TableRound";

const Table: FC = () => {
  const rounds = useAppSelector(selectRounds);
  const player = useAppSelector(selectPlayer);
  const playerPoint = useAppSelector(selectPlayerPoint);
  const playerRank = useAppSelector(selectPlayerRank);
  const isGameEnded = useAppSelector(selectEndGame);

  const colorClasses = useCallback((rank: number) => {
    switch (rank) {
      case 1:
        return "text-red-500 font-bold";
      case 2:
        return "text-orange-500";
      case 3:
        return "text-green-500";
      default:
        return "text-gray-900";
    }
  }, []);

  return (
    <section>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>No.</th>
            <th>{player.A}</th>
            <th>{player.B}</th>
            <th>{player.C}</th>
            <th>{player.D}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rounds.map((round: IGambleRound, index: number) => (
            <TableRound
              key={index}
              round={round}
              index={index}
              isAbleToDelete
            />
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th></th>
            <th>{player.A}</th>
            <th>{player.B}</th>
            <th>{player.C}</th>
            <th>{player.D}</th>
            <th></th>
          </tr>
        </tfoot>
        {isGameEnded ? (
          <tfoot>
            <tr>
              <td className="font-bold">TOTAL</td>
              <td className={colorClasses(playerRank.A)}>{playerPoint.A}</td>
              <td className={colorClasses(playerRank.B)}>{playerPoint.B}</td>
              <td className={colorClasses(playerRank.C)}>{playerPoint.C}</td>
              <td className={colorClasses(playerRank.D)}>{playerPoint.D}</td>
              <td className="font-bold">ENDED</td>
            </tr>
          </tfoot>
        ) : (
          <AddRow />
        )}
      </table>
    </section>
  );
};

export default Table;
