import useProfiles from "@/hooks/useUserProfiles";
import { FC, useCallback, useMemo } from "react";
import { ProfileBar } from "./profile-bar";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  decrease,
  increase,
  resetBoard,
  selectFreeBoardPayback,
  selectFreeBoardPoints,
  selectFreeBoardValidity,
  selectPointByProfileId,
} from "./freeboardSlice";
import PaybackBoard from "../PaybackBoard";
import { InputPoint, Payback } from "@/lib/payback";
import SendResultToSlack from "../SendResultToSlack";
import { Button } from "../ui/button";

export const FreeBoard: FC = () => {
  const profiles = useProfiles();
  const sortedProfiles = profiles?.sort(
    (a, b) => a?.name?.localeCompare(b?.name ?? "") ?? 0,
  );
  const dispatch = useAppDispatch();
  const pointByProfileId = useAppSelector(selectPointByProfileId);
  const paybacks = useAppSelector(selectFreeBoardPayback);
  const points = useAppSelector(selectFreeBoardPoints);
  const isBoardValid = useAppSelector(selectFreeBoardValidity);

  const increasePoint = useCallback(
    (profileId: string) => {
      dispatch(
        increase({
          profileId,
        }),
      );
    },
    [dispatch],
  );

  const decreasePoint = useCallback(
    (profileId: string) => {
      dispatch(
        decrease({
          profileId,
        }),
      );
    },
    [dispatch],
  );

  const handleOnChange = useCallback(
    (profileId: string, point: number) => {
      if (point > 0) {
        increasePoint(profileId);
      } else {
        decreasePoint(profileId);
      }
    },
    [increasePoint, decreasePoint],
  );

  const namedPayback = useMemo(() => {
    const newMap: Payback = new Map();
    Array.from(paybacks.entries()).forEach((record) => {
      console.log(record);
      const name =
        profiles?.find((player) => player.id === record[0])?.name ?? "Unknown";
      const debtors = record[1].map((debtor) => {
        const debtorName =
          profiles?.find((profile) => profile.id === debtor.player)?.name ??
          "Unknown";
        return {
          player: debtorName,
          amount: debtor.amount,
        };
      });
      newMap.set(name, debtors);
    });

    return newMap;
  }, [paybacks, profiles]);

  const namedTotals = useMemo(() => {
    const board: InputPoint = {};
    Object.keys(points).forEach((id) => {
      const name =
        profiles?.find((player) => player.id === id)?.name ?? "Unknown";
      board[name] = points[id];
    });
    return board;
  }, [points, profiles]);

  const handleResetBoard = useCallback(() => {
    dispatch(resetBoard());
  }, [dispatch]);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Gamer</TableCell>
            <TableCell className="text-center">Point</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProfiles?.map((profile, index) => (
            <TableRow key={index}>
              <TableCell className="text-xl">{profile.name}</TableCell>
              <TableCell>
                <ProfileBar
                  profileId={profile?.id ?? ""}
                  point={pointByProfileId(profile?.id ?? "") ?? 0}
                  onChange={handleOnChange}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>
              <Button
                variant={"destructive"}
                onClick={handleResetBoard}
                className="w-full"
                size={"lg"}
              >
                Reset
              </Button>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      {namedPayback.size > 0 && (
        <div className="mt-4 rounded border border-primary p-4">
          <h1 className="mb-4 text-center text-4xl">Summary</h1>
          {isBoardValid ? (
            <>
              <PaybackBoard paybacks={namedPayback} />
              <SendResultToSlack
                className="mt-5 w-full"
                playerPoints={namedTotals}
                paybacks={namedPayback}
              />
            </>
          ) : (
            <div className="text-red-500">
              Please check again. Sum of points must be 0. Someone&apos;s point is
              missing.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
