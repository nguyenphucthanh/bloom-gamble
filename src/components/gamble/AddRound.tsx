import React, { FC, useCallback, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { IGambleRound, PlayerKey, newRound, selectPlayer } from "./gambleSlice";
import { partition, sortBy } from "lodash";
import { fullFillRound, parseRoundString } from "../../lib/convert-pattern";
import VoiceButton from "./VoiceButton";
import EnterPoint from "./EnterPoint";

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
  const [round, setRound] = useState<{
    [key: string]: number | null;
  }>({
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
      dispatch(
        newRound({
          A: A,
          B: B,
          C: C,
          D: D,
        })
      );
    },
    [dispatch]
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
            }
            return {
              A: calc.A ?? null,
              B: calc.B ?? null,
              C: calc.C ?? null,
              D: calc.D ?? null,
            };
          });
        }
      }
    },
    [addNewRound, calcLastPlayerPoint]
  );

  const convertSmartFill = useCallback(() => {
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
        <td>New</td>
        {sortBy(Object.keys(round)).map((id: string) => (
          <td key={id}>
            <EnterPoint
              key={id}
              playerName={players[id as PlayerKey]}
              value={round[id as string] ?? null}
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
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
        </td>
      </tr>
      <tr>
        <td>OR</td>
        <td colSpan={4}>
          <label title={"PatternInput"} className="flex">
            <input
              placeholder="A 1 B 2 C 3"
              type="text"
              className="text-black block w-full rounded text-2xl p-1 border border-gray-300 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300 uppercase"
              value={smartFill}
              onChange={(e) => {
                setSmartFill(e.target.value);
              }}
            />
            <VoiceButton callback={setSmartFill} />
          </label>
          <div>Chỉ cần ghi người thua, điểm tự đảo dấu</div>
        </td>
        <td>
          <button
            title="Convert"
            className="bg-blue-500 text-white text-2xl p-2 rounded-full disabled:opacity-30"
            onClick={convertSmartFill}
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
                d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m0-3l-3-3m0 0l-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75"
              />
            </svg>
          </button>
        </td>
      </tr>
    </>
  );
};

export default AddRow;
