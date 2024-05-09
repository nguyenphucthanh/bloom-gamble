import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import {
  addDays,
  differenceInDays,
  endOfDay,
  format,
  startOfDay,
} from "date-fns";
import Link from "next/link";
import Report from "@/components/Report";
import { GAME_TYPE } from "@/consts";
import { getServerAuth } from "@/utils/supabase/getServerAuth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { TIME_FORMATS, formatUTCDate } from "@/lib/datetime";

export const metadata: Metadata = {
  title: "Thống kê",
  description: "Work Hard Play Harder",
};

const gameTitle = {
  [GAME_TYPE.TIEN_LEN]: "Tiến Lên",
  [GAME_TYPE.BI_LAC]: "Bi lắc",
};

export default async function PageReportGameTienLen({
  params,
  searchParams,
}: {
  params: {
    game: GAME_TYPE;
  };
  searchParams: {
    dateFrom?: string; // yyyy-MM-dd
    dateTo?: string; // yyyy-MM-dd
  };
}) {
  const auth = await getServerAuth();

  if (!auth?.user) {
    redirect(`/login?redirect=/report/${params.game}`);
  }

  const dateFrom = searchParams.dateFrom
    ? startOfDay(new Date(searchParams.dateFrom))
    : startOfDay(addDays(new Date(), -7));
  const dateTo = searchParams.dateTo
    ? endOfDay(new Date(searchParams.dateTo))
    : endOfDay(new Date());
  const formatedDateFrom = formatUTCDate(
    dateFrom,
    TIME_FORMATS.SUPABASE_DATETIME,
  );
  const formatedDateTo = formatUTCDate(dateTo, TIME_FORMATS.SUPABASE_DATETIME);

  const buildLink = (days: number, back = 0) => {
    const dateFromParam = format(
      addDays(new Date(), -days - back),
      TIME_FORMATS.SUPABASE_DATE,
    );
    const dateToParam = format(
      addDays(new Date(), 0 - back),
      TIME_FORMATS.SUPABASE_DATE,
    );
    return `/report/${params.game}?dateFrom=${dateFromParam}&dateTo=${dateToParam}`;
  };

  const dayGap = differenceInDays(formatedDateTo, formatedDateFrom);
  const isToday =
    format(dateTo, TIME_FORMATS.SUPABASE_DATE) ===
      format(new Date(), TIME_FORMATS.SUPABASE_DATE) && dayGap === 1;
  const isYesterday =
    format(dateTo, TIME_FORMATS.SUPABASE_DATE) ===
      format(addDays(new Date(), -1), TIME_FORMATS.SUPABASE_DATE) &&
    dayGap === 1;

  return (
    <div>
      <h2 className="mb-3 text-lg font-bold">{gameTitle[params.game]}</h2>
      <div className="my-5 flex flex-wrap justify-end gap-1">
        <Button variant={dayGap === 90 ? "default" : "outline"} asChild>
          <Link href={buildLink(90)}>90d</Link>
        </Button>
        <Button variant={dayGap === 60 ? "default" : "outline"} asChild>
          <Link href={buildLink(60)}>60d</Link>
        </Button>
        <Button variant={dayGap === 30 ? "default" : "outline"} asChild>
          <Link href={buildLink(30)}>30d</Link>
        </Button>
        <Button variant={dayGap === 14 ? "default" : "outline"} asChild>
          <Link href={buildLink(14)}>14d</Link>
        </Button>
        <Button variant={dayGap === 7 ? "default" : "outline"} asChild>
          <Link href={buildLink(7)}>7d</Link>
        </Button>
        <Button variant={isToday ? "default" : "outline"} asChild>
          <Link href={buildLink(1)}>today</Link>
        </Button>
        <Button variant={isYesterday ? "default" : "outline"} asChild>
          <Link href={buildLink(1, 1)}>yesterday</Link>
        </Button>
      </div>
      <Report
        gameType={params.game}
        dateFrom={formatedDateFrom}
        dateTo={formatedDateTo}
      />
      <div className="mb-5 mt-5 text-left">
        <Button asChild variant={"outline"}>
          <Link href={"/"} className="inline-flex gap-2">
            <ArrowLeftIcon />
            <span>Trở lại</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
