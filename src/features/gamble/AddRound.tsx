import React, { FC, useCallback, useMemo, useState } from "react"
import { useAppDispatch } from "../../app/hooks"
import { IGambleRound, newRound } from "./gambleSlice"
import { partition } from "lodash"

const AddRow: FC = () => {
  const dispatch = useAppDispatch()
  const [round, setRound] = useState<{
    [key: string]: number | null
  }>({
    A: null,
    B: null,
    C: null,
    D: null,
  })

  const setPoint = useCallback((name: string, value: number) => {
    setRound((prev) => ({
      ...prev,
      [name]: value,
    }))
  }, [])

  const addRound = useCallback(() => {
    const { A, B, C, D } = round
    dispatch(
      newRound({
        A,
        B,
        C,
        D,
      } as IGambleRound),
    )
    setRound({
      A: null,
      B: null,
      C: null,
      D: null,
    })
  }, [dispatch, round])

  const isAbleToAdd = useMemo(() => {
    const isAllValued =
      round.A !== null &&
      round.A !== undefined &&
      typeof round.A === "number" &&
      round.B !== null &&
      round.B !== undefined &&
      typeof round.B === "number" &&
      round.C !== null &&
      round.C !== undefined &&
      typeof round.C === "number" &&
      round.D !== null &&
      round.D !== undefined &&
      typeof round.D === "number"

    if (isAllValued) {
      // enter 4 zeros
      if (!round.A && !round.B && !round.C && !round.D) {
        return false
      }
      const total =
        (round.A ?? 0) + (round.B ?? 0) + (round.C ?? 0) + (round.D ?? 0)
      if (total !== 0) {
        return false
      }
    } else {
      return false
    }

    return true
  }, [round])

  const onBlur = useCallback((playerKey: string, value: number) => {
    const keys = ["A", "B", "C", "D"]
    // case white win
    if (value === 39) {
      const [_entered, left] = partition(keys, (k) => k === playerKey)
      setRound((prev) => {
        const next = { ...prev }
        left.forEach((key: string) => {
          next[key] = -13
        })
        return next
      })
    } else {
      // not white win
      setRound((prev) => {
        const [entered, empties] = partition(keys, (k: string) => {
          return prev[k] !== null && prev[k] !== undefined
        })
        if (empties.length === 1) {
          let autoValue = 0
          entered.forEach((e: string) => {
            autoValue -= prev[e] ?? 0
          })
          const next = { ...prev }

          next[empties[0]] = autoValue
          return next
        }

        return prev
      })
    }
  }, [])

  return (
    <tfoot>
      <tr>
        <td>New</td>
        {Object.keys(round).map((id) => (
          <td key={id}>
            <label title={id}>
              <input
                placeholder="0"
                type="number"
                className="text-black block w-full rounded text-2xl p-1 border border-gray-300 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={round[id as string] ?? ""}
                onChange={(e) =>
                  setPoint(id, parseFloat(e.target.value || "0"))
                }
                onBlur={(e) => {
                  onBlur(id, parseFloat(e.target.value || "0"))
                }}
                min={-200}
                max={200}
                step={1}
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
    </tfoot>
  )
}

export default AddRow
