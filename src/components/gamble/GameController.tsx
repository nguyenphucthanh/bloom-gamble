import React, { FC, useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { endGame, resetAll, selectEndGame, selectRounds } from "./gambleSlice";
import PhoneCallModal from "./PhoneCallModal";
import ConfirmDeleteRoundModal from "./ConfirmDeleteRoundModal";
import ConfirmEndGameModal from "./ConfirmEndGameModal";
import IconRefresh from "../icons/refresh";

const GameController: FC = () => {
  const isGameEnded = useAppSelector(selectEndGame);
  const rounds = useAppSelector(selectRounds);
  const [callTitle, setCallTitle] = useState("");
  const [showCallModal, setShowCallModal] = useState(false);
  const [showEndGameModal, setShowEndGameModal] = useState(false);
  const dispatch = useAppDispatch();

  const restartGame = useCallback(() => {
    dispatch(resetAll());
  }, [dispatch]);

  const endThisGame = useCallback(() => {
    setShowEndGameModal(true);
  }, []);

  const openCallModal = useCallback((title: string) => {
    setCallTitle(title);
    setShowCallModal(true);
  }, []);

  const closeCallModal = useCallback(() => {
    setShowCallModal(false);
  }, []);

  const closeEndGameModal = useCallback(() => {
    setShowEndGameModal(false);
  }, []);

  const onConfirmEndGame = useCallback(() => {
    setShowEndGameModal(false);
    dispatch(endGame());
  }, [dispatch]);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 mt-5">
        {isGameEnded || !rounds.length ? (
          <button
            className="font-bold bg-green-500 text-white rounded p-3 text-center justify-center inline-flex gap-2 w-full col-span-2"
            onClick={restartGame}
          >
            <IconRefresh />
            <span>New Game</span>
          </button>
        ) : (
          <button
            disabled={rounds.length === 0}
            className="font-bold bg-blue-500 text-white rounded p-3 text-center justify-center inline-flex gap-2 w-full col-span-2 disabled:opacity-50 uppercase"
            onClick={endThisGame}
          >
            <span>End Game</span>
          </button>
        )}
      </div>
      <PhoneCallModal
        title={callTitle}
        isOpen={showCallModal}
        closeModal={closeCallModal}
      />
      <ConfirmEndGameModal
        isOpen={showEndGameModal}
        closeModal={closeEndGameModal}
        confirm={onConfirmEndGame}
      />
    </>
  );
};

export default GameController;
