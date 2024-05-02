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
      {dateDiff > 1 && (
        <div className="mb-6 flex justify-between gap-3">
          <div>{dateDiff} ngày</div>
          <div className="inline-flex flex-1 flex-row items-center justify-end gap-1">
            {format(dateFrom, "dd-MM-yy")} <ArrowRightIcon />{" "}
            {format(dateTo, "dd-MM-yy")}
          </div>
        </div>
      )}
      <Table>
        <TableHeader className="bg-gray-200">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Point</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedResponse.map((item) => (
            <TableRow key={item.name}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.point}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
