import React, { FC, useCallback, useState } from "react";
import {
  IGambleRound,
  INullableGambleRound,
  PlayerKey,
  selectPlayer,
} from "./gambleSlice";
import { useAppSelector } from "@/store/hooks";
import PointNumpad from "./PointNumpad";

export interface IEnterLoserPointProps {
  winnerId: PlayerKey;
  onChange: (round: IGambleRound) => void;
}

const EnterLoserPoint: FC<IEnterLoserPointProps> = ({ onChange, winnerId }) => {
  const [round, setRound] = useState<INullableGambleRound>({
    A: null,
    B: null,
    C: null,
    D: null,
  });
  const players = useAppSelector(selectPlayer);

  const [open, setOpen] = useState(false);
  const [enteringPlayerKey, setEnteringPlayerKey] =
    useState<PlayerKey | null>();

  const getNextPlayerKey = useCallback(
    (round: INullableGambleRound) => {
      const otherPlayerKeys = Object.keys(round).find(
        (key) => key !== winnerId && !round[key as PlayerKey]
      );
      return otherPlayerKeys as PlayerKey;
    },
    [winnerId]
  );

  const startFlow = useCallback(() => {
    const newRound: INullableGambleRound = {
      A: null,
      B: null,
      C: null,
      D: null,
    }
    setRound(newRound)
    const nextKey = getNextPlayerKey(newRound);
    if (nextKey) {
      setEnteringPlayerKey(nextKey);
      setOpen(true);
    }
  }, [round, getNextPlayerKey]);

  const onChangePoint = useCallback(
    (point: number | null) => {
      if (enteringPlayerKey && point) {
        setRound((prev) => {
          const next = {
            ...prev,
            [enteringPlayerKey]: point,
          };

          const nextKey = getNextPlayerKey(next);
          if (nextKey) {
            setEnteringPlayerKey(nextKey);
            setOpen(false);
            setTimeout(() => {
              setOpen(true);
            });
          } else {
            let sum = 0;
            Object.values(next).forEach((p) => {
              if (p) {
                sum += p;
              }
            });
            next[winnerId] = 0 - sum;
            onChange(next as IGambleRound);
            setOpen(false);
          }

          return next;
        });
      }
    },
    [enteringPlayerKey, getNextPlayerKey, onChange, winnerId]
  );

  return (
    <>
      <button
        className="bg-gray-100 border border-gray-300 text-gray-900 rounded text-sm p-3 px-1 block w-10  "
        onClick={() => {
          startFlow();
        }}
      >
        {"🏆"}
      </button>
      <PointNumpad
        playerName={enteringPlayerKey ? players[enteringPlayerKey] : ""}
        value={enteringPlayerKey ? round[enteringPlayerKey] : null}
        onChange={onChangePoint}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export default EnterLoserPoint;
