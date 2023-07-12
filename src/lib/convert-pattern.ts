import { partition } from "lodash";
import {
  IGambleRound,
  IGambleState,
  PlayerKey,
} from "../components/gamble/gambleSlice";
/**
 * create a function, input is a string following this pattern "A 1 B 2 C 3"
 * then convert into an object { "A": -1, "B": -2, "C": -3 }
 */
export const parseRoundString = (
  str: string,
  players: IGambleState["player"]
): Record<string, number | null> => {
  const result: Record<string, number> = {};
  const splitted = str.split(" ");

  const playerNames = Object.values(players).map((name) => name.toLowerCase());
  for (let i = 0; i < splitted.length; i += 2) {
    const name = splitted[i].toLowerCase();
    const playerKey = Object.keys(players).find(
      (key: string) => players[key as PlayerKey].toLowerCase() === name
    );

    if (playerNames.includes(name)) {
      result[playerKey as PlayerKey] = parseInt(splitted[i + 1]);
    }
  }

  return result;
};

export const fullFillRound = (
  parsedObject: Record<string, number | null>
): IGambleRound | null => {
  const keys: PlayerKey[] = ["A", "B", "C", "D"];
  const keysOfParsedObject = Object.keys(parsedObject);
  const [entered, notEntered] = partition(keys, (key) =>
    keysOfParsedObject.includes(key)
  );

  const next: Record<string, number | null> = {
    ...parsedObject,
  };

  if (notEntered.length === 1) {
    let total = 0;

    entered.forEach((key) => {
      total -= parsedObject[key] ?? 0;
    });

    next[notEntered[0]] = total;
  } else {
    notEntered.forEach((key) => {
      next[key] = null;
    });
  }

  return next as IGambleRound;
};
