import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import Link from "next/link";
import Report from "@/components/Report";
import { GAME_TYPE } from "@/consts";
import { getServerAuth } from "@/utils/supabase/getServerAuth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

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
    ? searchParams.dateFrom
    : format(addDays(new Date(), -7), "yyyy-MM-dd");
  const dateTo = searchParams.dateTo
    ? searchParams.dateTo
    : format(new Date(), "yyyy-MM-dd");

  const buildLink = (days: number) => {
    const dateTo = format(new Date(), "yyyy-MM-dd");
    const dateFrom = format(addDays(new Date(), -days), "yyyy-MM-dd");
    return `/game-tien-len/report?dateFrom=${dateFrom}&dateTo=${dateTo}`;
  };

  return (
    <div>
      <h1 className="mb-3 mt-3 text-xl font-bold">Thống kê</h1>
      <h2 className="mb-3 text-lg font-bold">{gameTitle[params.game]}</h2>
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
      <Report gameType={params.game} dateFrom={dateFrom} dateTo={dateTo} />
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
