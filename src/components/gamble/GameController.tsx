import React, { FC, useCallback, useState, useTransition } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  endGame,
  resetAll,
  selectEndGame,
  selectGameId,
  selectPlayer,
  selectPlayerPoint,
  selectRounds,
} from "./gambleSlice";
import PhoneCallModal from "./PhoneCallModal";
import ConfirmEndGameModal from "./ConfirmEndGameModal";
import IconRefresh from "../icons/refresh";
import { api } from "@/trpc/react";
import { useToast } from "../ui/use-toast";
import { LoaderCircle } from "lucide-react";

const GameController: FC = () => {
  const isGameEnded = useAppSelector(selectEndGame);
  const rounds = useAppSelector(selectRounds);
  const gameId = useAppSelector(selectGameId);
  const players = useAppSelector(selectPlayer);
  const playerPoints = useAppSelector(selectPlayerPoint);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showEndGameModal, setShowEndGameModal] = useState(false);
  const dispatch = useAppDispatch();
  const endGameMutation = api.game.endGame.useMutation();
  const { toast } = useToast();
  const [isEnding, startEndingTransition] = useTransition();

  const restartGame = useCallback(() => {
    dispatch(resetAll());
  }, [dispatch]);

  const endThisGame = useCallback(() => {
    setShowEndGameModal(true);
  }, []);

  const closeCallModal = useCallback(() => {
    setShowCallModal(false);
  }, []);

  const closeEndGameModal = useCallback(() => {
    setShowEndGameModal(false);
  }, []);

  const onConfirmEndGame = useCallback(() => {
    startEndingTransition(async () => {
      try {
        setShowEndGameModal(false);
        await endGameMutation.mutateAsync({
          id: gameId,
          players: [
            {
              userProfile_id: players.A,
              points: playerPoints.A,
            },
            {
              userProfile_id: players.B,
              points: playerPoints.B,
            },
            {
              userProfile_id: players.C,
              points: playerPoints.C,
            },
            {
              userProfile_id: players.D,
              points: playerPoints.D,
            },
          ],
        });
        dispatch(endGame());
      } catch (ex) {
        const msg = ex instanceof Error ? ex.message : "Failed to end game";
        toast({
          title: "Error",
          description: msg,
        });
      }
    });
  }, [dispatch, gameId, players, playerPoints, endGameMutation, toast]);

  return (
    <>
      <div className="mt-5 grid grid-cols-2 gap-4">
        {isGameEnded || !rounds.length ? (
          <button
            className="col-span-2 inline-flex w-full justify-center gap-2 rounded bg-green-500 p-3 text-center font-bold text-white"
            onClick={restartGame}
          >
            <IconRefresh />
            <span>New Game</span>
          </button>
        ) : (
          <button
            disabled={rounds.length === 0 || isEnding}
            className="col-span-2 inline-flex w-full justify-center gap-2 rounded bg-blue-500 p-3 text-center font-bold uppercase text-white disabled:opacity-50"
            onClick={endThisGame}
          >
            {isEnding ? <LoaderCircle className="animate-spin" /> : null}
            <span>End Game</span>
          </button>
        )}
      </div>
      <PhoneCallModal
        title={""}
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
