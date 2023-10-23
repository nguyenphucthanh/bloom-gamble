import React, { FC, useCallback, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  IGambleRound,
  INullableGambleRound,
  PlayerKey,
  newRound,
  selectPlayer,
} from "./gambleSlice";
import { partition, sortBy } from "lodash";
import { fullFillRound, parseRoundString } from "../../lib/convert-pattern";
import VoiceButton from "./VoiceButton";
import EnterPoint from "./EnterPoint";
import { speak } from "@/app/utils/speech";
import EnterLoserPoint from "./EnterLoserPoint";
import { congrats } from "@/app/utils/ai";
import axios from "axios";
import IconPlus from "../icons/plus";

const validateRound = (round: IGambleRound): boolean => {
  const { A, B, C, D } = round;
  const isAllValued =
    A !== null &&
    A !== undefined &&
    typeof A === "number" &&
    B !== null &&
    B !== undefined &&
    typeof B === "number" &&
    C !== null &&
    C !== undefined &&
    typeof C === "number" &&
    D !== null &&
    D !== undefined &&
    typeof D === "number";

  if (isAllValued) {
    // enter 4 zeros
    if (!A && !B && !C && !D) {
      return false;
    }
    const total = (A ?? 0) + (B ?? 0) + (C ?? 0) + (D ?? 0);
    if (total !== 0) {
      return false;
    }
  } else {
    return false;
  }

  return true;
};

const AddRow: FC = () => {
  const players = useAppSelector(selectPlayer);
  const dispatch = useAppDispatch();
  const [round, setRound] = useState<INullableGambleRound>({
    A: null,
    B: null,
    C: null,
    D: null,
  });
  const [smartFill, setSmartFill] = useState("");

  const setPoint = useCallback((name: string, value: number | null) => {
    setRound((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const addNewRound = useCallback(
    (round: IGambleRound) => {
      const { A, B, C, D } = round;
      const sortedRound = Object.entries(round).sort(
        ([, valueA], [, valueB]) => valueA - valueB
      );
      const playerMessages = sortedRound.map(([key, point]) =>
        point !== null
          ? `${players[key as PlayerKey]}: ${
              point >= 0 ? "cộng " : "trừ "
            }${Math.abs(point)}`
          : null
      );
      // Create an array of strings for each player's name and value
      // const playerMessages = [
      //   A !== null ? `${players.A}: ${A >= 0 ? '+' : '-'}${Math.abs(A)}` : null,
      //   B !== null ? `${players.B}: ${B >= 0 ? '+' : '-'}${Math.abs(B)}` : null,
      //   C !== null ? `${players.C}: ${C >= 0 ? '+' : '-'}${Math.abs(C)}` : null,
      //   D !== null ? `${players.D}: ${D >= 0 ? '+' : '-'}${Math.abs(D)}` : null,
      // ].filter(Boolean);

      if (playerMessages.length > 0) {
        const message = `Kết quả: ${playerMessages.join(", ")}.`;
        speak(message);

        const max = Math.max(A, B, C, D);
        const maxKey = Object.keys(round).find(
          (key) => round[key as PlayerKey] === max
        );
        const names = Object.keys(round).map(
          (key) => players[key as PlayerKey]
        );
        const winnerName = players[maxKey as PlayerKey];

        axios
          .post("/api/ai", {
            names,
            winnerName,
          })
          .then((response) => {
            const mes = response.data.message;
            if (mes) {
              speak(mes);
              axios.post("/api/slack", {
                text: `[LIVE STREAM] ${message}. ${mes}`,
              });
            }
          })
          .catch(() => {
            console.error("Could not get from AI");
          });
      }

      dispatch(
        newRound({
          A: A,
          B: B,
          C: C,
          D: D,
        })
      );
    },
    [dispatch, players]
  );

  const onSubmit = useCallback(() => {
    const { A, B, C, D } = round;
    addNewRound({
      A,
      B,
      C,
      D,
    } as IGambleRound);
    setRound({
      A: null,
      B: null,
      C: null,
      D: null,
    });
  }, [addNewRound, round]);

  const isAbleToAdd = useMemo(() => {
    return validateRound(round as IGambleRound);
  }, [round]);

  const calcLastPlayerPoint = useCallback((prev: IGambleRound) => {
    const keys: PlayerKey[] = ["A", "B", "C", "D"];
    const [entered, empties] = partition(keys, (k: string) => {
      return (
        prev[k as PlayerKey] !== null && prev[k as PlayerKey] !== undefined
      );
    });
    if (empties.length === 1) {
      let autoValue = 0;
      entered.forEach((e: string) => {
        autoValue -= prev[e as PlayerKey] ?? 0;
      });
      const next = { ...prev };

      next[empties[0]] = autoValue;
      return next;
    }

    return prev;
  }, []);

  const onAfterChange = useCallback(
    (playerKey: string, value: number | null) => {
      const keys = ["A", "B", "C", "D"];
      // case white win
      if (value !== null && value !== undefined && !isNaN(value)) {
        if (value === 39) {
          const [, left] = partition(keys, (k) => k === playerKey);
          const next = {
            [playerKey]: 39,
          };
          left.forEach((key) => {
            next[key] = -13;
          });
          addNewRound(next as IGambleRound);
          setRound({
            A: null,
            B: null,
            C: null,
            D: null,
          });
        } else {
          // not white win
          setRound((prev) => {
            const calc = calcLastPlayerPoint({
              A: prev.A ?? null,
              B: prev.B ?? null,
              C: prev.C ?? null,
              D: prev.D ?? null,
            } as IGambleRound);
            if (validateRound(calc)) {
              addNewRound(calc);
              return {
                A: null,
                B: null,
                C: null,
                D: null,
              };
            } else {
              return {
                A: calc.A ?? null,
                B: calc.B ?? null,
                C: calc.C ?? null,
                D: calc.D ?? null,
              };
            }
          });
        }
      }
    },
    [addNewRound, calcLastPlayerPoint]
  );

  const _convertSmartFill = useCallback(() => {
    const parsedRound = fullFillRound(parseRoundString(smartFill, players));
    if (parsedRound) {
      let next = {
        A: parsedRound.A ?? parsedRound.A ?? null,
        B: parsedRound.B ?? parsedRound.B ?? null,
        C: parsedRound.C ?? parsedRound.C ?? null,
        D: parsedRound.D ?? parsedRound.D ?? null,
      };
      next = calcLastPlayerPoint(next);
      const isValid = validateRound(next);
      if (!isValid) {
        setRound({
          A: next.A ? -next.A : null,
          B: next.B ? -next.B : null,
          C: next.C ? -next.C : null,
          D: next.D ? -next.D : null,
        });
      } else {
        addNewRound({
          A: -next.A,
          B: -next.B,
          C: -next.C,
          D: -next.D,
        });
        setRound({
          A: null,
          B: null,
          C: null,
          D: null,
        });
      }
      setSmartFill("");
    }
  }, [smartFill, players, calcLastPlayerPoint, addNewRound]);

  return (
    <>
      <tr>
        <td className="text-xs">Nhập điểm từng thằng</td>
        {sortBy(Object.keys(round)).map((id: string) => (
          <td key={id}>
            <EnterPoint
              key={id}
              playerName={players[id as PlayerKey]}
              value={round[id as PlayerKey] ?? null}
              onChange={(value: number | null) => {
                setPoint(id, value);
                onAfterChange(id, value);
              }}
            />
          </td>
        ))}
        <td>
          <button
            disabled={!isAbleToAdd}
            title="Add"
            className="bg-blue-500 text-white text-2xl p-2 rounded-full disabled:opacity-30"
            onClick={onSubmit}
          >
            <IconPlus />
          </button>
        </td>
      </tr>
      <tr>
        <td className="text-xs">
          Nhấp thằng thắng
          <br />
          (Tới trắng x 2)
        </td>
        {sortBy(Object.keys(round)).map((id: string) => (
          <td key={id}>
            <EnterLoserPoint
              winnerId={id as PlayerKey}
              key={id}
              onChange={(r: IGambleRound) => {
                addNewRound(r);
              }}
            />
          </td>
        ))}
        <td></td>
      </tr>
    </>
  );
};

export default AddRow;
