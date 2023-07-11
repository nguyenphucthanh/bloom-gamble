import { partition } from "lodash"
import { IGambleRound, PlayerKey } from "./../../features/gamble/gambleSlice"
/**
 * create a function, input is a string following this pattern "A 1 B 2 C 3"
 * then convert into an object { "A": -1, "B": -2, "C": -3 }
 */
export const parseRoundString = (
  str: string,
): Record<string, number | null> => {
  const result: Record<string, number> = {}
  const splitted = str.split(" ")

  for (let i = 0; i < splitted.length; i += 2) {
    const key = splitted[i].toUpperCase()
    if (["A", "B", "C", "D"].includes(key))
      result[key] = -parseInt(splitted[i + 1])
  }

  return result
}

export const fullFillRound = (
  parsedObject: Record<string, number | null>,
): IGambleRound | null => {
  const keys: PlayerKey[] = ["A", "B", "C", "D"]
  const keysOfParsedObject = Object.keys(parsedObject)
  const [entered, notEntered] = partition(keys, (key) =>
    keysOfParsedObject.includes(key),
  )

  const next: Record<string, number | null> = {
    ...parsedObject,
  }

  if (notEntered.length === 1) {
    let total = 0

    entered.forEach((key) => {
      total -= parsedObject[key] ?? 0
    })

    next[notEntered[0]] = total
  } else {
    notEntered.forEach((key) => {
      next[key] = null
    })
  }

  return next as IGambleRound
}
