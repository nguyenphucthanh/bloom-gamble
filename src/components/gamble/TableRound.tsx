import React, { FC, useCallback, useState } from "react";

import { IGambleRound, removeRound, selectEndGame } from "./gambleSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import ConfirmDeleteRoundModal from "./ConfirmDeleteRoundModal";
import IconTrash from "../icons/trash";

export interface ITableRoundProps {
  round: IGambleRound;
  index: number;
  isAbleToDelete?: boolean;
}

const TableRound: FC<ITableRoundProps> = ({ round, index, isAbleToDelete }) => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const dispatch = useAppDispatch();
  const isMax = useCallback(
    (point: number) => {
      const max = Math.max(round.A, round.B, round.C, round.D);
      return max === point;
    },
    [round]
  );

  const isGameEnded = useAppSelector(selectEndGame);

  const deleteRound = useCallback(() => {
    setOpenConfirm(true);
  }, []);

  const confirmDeleteRound = useCallback(() => {
    dispatch(removeRound(index));
    setOpenConfirm(false);
  }, [index, dispatch]);

  const closeConfirm = useCallback(() => {
    setOpenConfirm(false);
  }, []);

  return (
    <tr>
      <td className="text-gray-300">{index + 1}</td>
      <td className={isMax(round.A) ? "text-red-500" : ""}>{round.A}</td>
      <td className={isMax(round.B) ? "text-red-500" : ""}>{round.B}</td>
      <td className={isMax(round.C) ? "text-red-500" : ""}>{round.C}</td>
      <td className={isMax(round.D) ? "text-red-500" : ""}>{round.D}</td>
      <td>
        {isAbleToDelete && !isGameEnded ? (
          <button
            title="Delete row"
            type="button"
            className="text-red-500 border-red-500 border text-2xl p-2 rounded-full"
            onClick={deleteRound}
          >
            <IconTrash />
          </button>
        ) : null}

        <ConfirmDeleteRoundModal
          round={round}
          isOpen={openConfirm}
          closeModal={closeConfirm}
          confirm={confirmDeleteRound}
        />
      </td>
    </tr>
  );
};

export default TableRound;
