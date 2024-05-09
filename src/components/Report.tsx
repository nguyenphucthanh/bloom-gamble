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

export type ReportProps = {
  gameType: GAME_TYPE;
  dateFrom: string;
  dateTo: string;
};

export default async function Report({
  gameType,
  dateFrom,
  dateTo,
}: ReportProps) {
  const response = await api.userProfilePoints.reportByDate.query({
    gameType,
    dateFrom,
    dateTo,
  });

  const sortedResponse = response.sort((a, b) => b.point - a.point);

  const dateDiff = Math.abs(differenceInDays(dateFrom, dateTo));

  return (
    <div>
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
                <TableCell className="text-right">{item.point}</TableCell>
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
    </div>
  );
}
