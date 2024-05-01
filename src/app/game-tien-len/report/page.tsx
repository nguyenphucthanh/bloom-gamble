import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GAME_TYPE } from "@/consts";
import { api } from "@/trpc/server";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { addDays, differenceInDays, format } from "date-fns";
import Link from "next/link";

export default async function PageReportGameTienLen({
  searchParams,
}: {
  searchParams: {
    dateFrom?: string; // yyyy-MM-dd
    dateTo?: string; // yyyy-MM-dd
  };
}) {
  const dateFrom = searchParams.dateFrom
    ? searchParams.dateFrom
    : format(addDays(new Date(), -7), "yyyy-MM-dd");
  const dateTo = searchParams.dateTo
    ? searchParams.dateTo
    : format(new Date(), "yyyy-MM-dd");
  const response = await api.userProfilePoints.reportByDate.query({
    gameType: GAME_TYPE.TIEN_LEN,
    dateFrom,
    dateTo,
  });

  const sortedResponse = response.sort((a, b) => b.point - a.point);

  const dateDiff = Math.abs(differenceInDays(dateFrom, dateTo));

  const buildLink = (days: number) => {
    const dateTo = format(new Date(), "yyyy-MM-dd");
    const dateFrom = format(addDays(new Date(), -days), "yyyy-MM-dd");
    return `/game-tien-len/report?dateFrom=${dateFrom}&dateTo=${dateTo}`;
  };

  return (
    <div>
      <h1 className="mb-3 mt-3 text-xl font-bold">Thống kê</h1>
      <div className="my-5 flex justify-end gap-1">
        <Button variant={"outline"} asChild>
          <Link href={buildLink(90)}>90d</Link>
        </Button>
        <Button variant={"outline"} asChild>
          <Link href={buildLink(60)}>60d</Link>
        </Button>
        <Button variant={"outline"} asChild>
          <Link href={buildLink(30)}>30d</Link>
        </Button>
        <Button variant={"outline"} asChild>
          <Link href={buildLink(14)}>14d</Link>
        </Button>
        <Button variant={"outline"} asChild>
          <Link href={buildLink(7)}>7d</Link>
        </Button>
      </div>
      <div className="mb-6 flex justify-between gap-3">
        <div>{dateDiff} ngày</div>
        <div className="inline-flex flex-1 flex-row items-center justify-end gap-1">
          {format(dateFrom, "dd-MM-yy")} <ArrowRightIcon />{" "}
          {format(dateTo, "dd-MM-yy")}
        </div>
      </div>
      <Table>
        <TableHeader className="bg-gray-200">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Point</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedResponse.map((item, index) => (
            <TableRow key={item.name}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.point}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mb-5 mt-5 text-left">
        <Button asChild variant={"outline"}>
          <Link href={"/game-tien-len"} className="inline-flex gap-2">
            <ArrowLeftIcon />
            <span>Trở lại</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
