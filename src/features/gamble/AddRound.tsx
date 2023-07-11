import React, { FC, useCallback, useMemo, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { IGambleRound, PlayerKey, newRound, selectPlayer } from "./gambleSlice"
import { partition, sortBy } from "lodash"
import { fullFillRound, parseRoundString } from "../../app/libs/convert-pattern"

const AddRow: FC = () => {
  const players = useAppSelector(selectPlayer)
  const dispatch = useAppDispatch()
  const [round, setRound] = useState<{
    [key: string]: string | null
  }>({
    A: null,
    B: null,
    C: null,
    D: null,
  })
  const [smartFill, setSmartFill] = useState("")

  const parsedRound = useMemo(() => {
    return {
      A: round.A ? parseInt(round.A || "0", 10) : null,
      B: round.B ? parseInt(round.B || "0", 10) : null,
      C: round.C ? parseInt(round.C || "0", 10) : null,
      D: round.D ? parseInt(round.D || "0", 10) : null,
    }
  }, [round])

  const setPoint = useCallback((name: string, value: string) => {
    setRound((prev) => ({
      ...prev,
      [name]: value,
    }))
  }, [])

  const addNewRound = useCallback(
    (round: IGambleRound) => {
      const { A, B, C, D } = round
      dispatch(
        newRound({
          A: -A,
          B: -B,
          C: -C,
          D: -D,
        }),
      )
    },
    [dispatch],
  )

  const addRound = useCallback(() => {
    const { A, B, C, D } = parsedRound
    addNewRound({
      A,
      B,
      C,
      D,
    } as IGambleRound)
    setRound({
      A: null,
      B: null,
      C: null,
      D: null,
    })
  }, [addNewRound, parsedRound])

  const isAbleToAdd = useMemo(() => {
    const { A, B, C, D } = parsedRound
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
      typeof D === "number"

    if (isAllValued) {
      // enter 4 zeros
      if (!A && !B && !C && !D) {
        return false
      }
      const total = (A ?? 0) + (B ?? 0) + (C ?? 0) + (D ?? 0)
      if (total !== 0) {
        return false
      }
    } else {
      return false
    }

    return true
  }, [parsedRound])

  const calcLastPlayerPoint = useCallback((prev: IGambleRound) => {
    const keys: PlayerKey[] = ["A", "B", "C", "D"]
    const [entered, empties] = partition(keys, (k: string) => {
      return prev[k as PlayerKey] !== null && prev[k as PlayerKey] !== undefined
    })
    if (empties.length === 1) {
      let autoValue = 0
      entered.forEach((e: string) => {
        autoValue -= prev[e as PlayerKey] ?? 0
      })
      const next = { ...prev }

      next[empties[0]] = autoValue
      return next
    }

    return prev
  }, [])

  const onBlur = useCallback(
    (playerKey: string, value: string) => {
      const keys = ["A", "B", "C", "D"]
      // case white win
      const parsed = parseInt(value, 10)
      if (!isNaN(parsed)) {
        if (parsed === 39) {
          const [, left] = partition(keys, (k) => k === playerKey)
          setRound((prev) => {
            const next = { ...prev }
            left.forEach((key: string) => {
              next[key] = "-13"
            })
            return next
          })
        } else {
          // not white win
          setRound((prev) => {
            const calc = calcLastPlayerPoint({
              A: prev.A ? parseInt(prev.A || "0", 10) : null,
              B: prev.B ? parseInt(prev.B || "0", 10) : null,
              C: prev.C ? parseInt(prev.C || "0", 10) : null,
              D: prev.D ? parseInt(prev.D || "0", 10) : null,
            } as IGambleRound)
            return {
              A: calc.A?.toString() || null,
              B: calc.B?.toString() || null,
              C: calc.C?.toString() || null,
              D: calc.D?.toString() || null,
            }
          })
        }
      }
    },
    [calcLastPlayerPoint],
  )

  const convertSmartFill = useCallback(() => {
    const parsedRound = fullFillRound(parseRoundString(smartFill, players))
    if (parsedRound) {
      let next = {
        A: parsedRound.A ?? parsedRound.A ?? null,
        B: parsedRound.B ?? parsedRound.B ?? null,
        C: parsedRound.C ?? parsedRound.C ?? null,
        D: parsedRound.D ?? parsedRound.D ?? null,
      }
      next = calcLastPlayerPoint(next)
      const anyUnfilled = Object.keys(next).find((key: string) => {
        return (
          next[key as PlayerKey] === null ||
          next[key as PlayerKey] === undefined
        )
      })
      if (anyUnfilled) {
        setRound({
          A: next.A.toString(),
          B: next.B.toString(),
          C: next.C.toString(),
          D: next.D.toString(),
        })
      } else {
        addNewRound(next)
        setRound({
          A: null,
          B: null,
          C: null,
          D: null,
        })
      }
      setSmartFill("")
    }
  }, [smartFill, players, calcLastPlayerPoint, addNewRound])

  return (
    <tfoot>
      <tr>
        <td>New</td>
        {sortBy(Object.keys(round)).map((id) => (
          <td key={id}>
            <label title={id}>
              <input
                type="text"
                placeholder="0"
                className="text-black block w-full rounded text-2xl p-1 border border-gray-300 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={round[id as string] ?? ""}
                onChange={(e) => setPoint(id, e.target.value)}
                onBlur={(e) => {
                  onBlur(id, e.target.value)
                }}
              />
            </label>
          </td>
        ))}
        <td>
          <button
            disabled={!isAbleToAdd}
            title="Add"
            className="bg-blue-500 text-white text-2xl p-3 rounded-full disabled:opacity-30"
            onClick={addRound}
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
          <label title={"PatternInput"}>
            <input
              placeholder="A 1 B 2 C 3"
              type="text"
              className="text-black block w-full rounded text-2xl p-1 border border-gray-300 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300 uppercase"
              value={smartFill}
              onChange={(e) => {
                setSmartFill(e.target.value)
              }}
            />
          </label>
          <div>Chỉ cần ghi người thua, điểm tự đảo dấu</div>
        </td>
        <td>
          <button
            title="Convert"
            className="bg-blue-500 text-white text-2xl p-3 rounded-full disabled:opacity-30"
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
    </tfoot>
  )
}

export default AddRow
