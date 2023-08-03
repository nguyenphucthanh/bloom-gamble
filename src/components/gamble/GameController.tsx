import React, { FC, useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { endGame, resetAll, selectEndGame, selectRounds } from "./gambleSlice";
import PhoneCallModal from "./PhoneCallModal";
import ConfirmDeleteRoundModal from "./ConfirmDeleteRoundModal";
import ConfirmEndGameModal from "./ConfirmEndGameModal";

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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>

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
