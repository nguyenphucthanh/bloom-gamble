import { GAME_TYPE } from "@/consts";
import { api } from "@/trpc/server";
import { differenceInDays, format } from "date-fns";
import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "./ui/table";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { TIME_FORMATS } from "@/lib/datetime";
import { payback } from "@/lib/payback";
import PaybackBoard from "./PaybackBoard";
import SendResultToSlack from "./SendResultToSlack";

export type ReportProps = {
  gameType: GAME_TYPE;
  dateFrom: string;
  dateTo: string;
  includePayback?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export default async function Report({
  gameType,
  dateFrom,
  dateTo,
  includePayback = false,
  ...props
}: ReportProps) {
  const response = await api.userProfilePoints.reportByDate.query({
    gameType,
    dateFrom,
    dateTo,
  });

  const sortedResponse = response.sort((a, b) => b.point - a.point);

  const dateDiff = Math.abs(differenceInDays(dateFrom, dateTo));

  const playerPoints: Record<string, number> = {};

  sortedResponse.forEach((item) => {
    playerPoints[item.name] = item.point;
  });

  const paybacks = payback(playerPoints);

  return (
    <div {...props}>
      <div className="mb-6 flex justify-between gap-3">
        <div>{dateDiff} ngày</div>
        <div className="inline-flex flex-1 flex-row items-center justify-end gap-1">
          {format(dateFrom, TIME_FORMATS.DISPLAY_DATE)}
          {dateDiff > 1 && (
            <>
              <ArrowRightIcon /> {format(dateTo, TIME_FORMATS.DISPLAY_DATE)}
            </>
          )}
        </div>
      </div>
      <Table data-date-from={dateFrom} data-date-to={dateTo}>
        <TableHeader className="bg-gray-200">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Point</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedResponse.length ? (
            sortedResponse.map((item) => (
              <TableRow key={item.name}>
                <TableCell>{item.name}</TableCell>
                <TableCell className="text-right">
                  <div
                    className={`inline-flex animate-number-appear transition-transform`}
                  >
                    {item.point}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} className="text-center">
                No records here
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {includePayback && (
        <div className="mt-6 rounded bg-slate-100 p-3 shadow">
          <h3 className="mb-3 text-xl font-bold">Thanh toán</h3>
          <PaybackBoard paybacks={paybacks} />
          <SendResultToSlack
            className="mt-5 w-full"
            playerPoints={playerPoints}
            paybacks={paybacks}
          />
        </div>
      )}
    </div>
  );
}
