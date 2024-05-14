import React, { Suspense } from "react";
import Report from "@/components/Report";
import { GAME_TYPE } from "@/consts";
import { endOfDay, startOfDay } from "date-fns";
import Loading from "./loading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BarChartIcon } from "lucide-react";
import { TIME_FORMATS, formatUTCDate } from "@/lib/datetime";

export const dynamic = "force-dynamic";

export const revalidate = 0;

export default function FoosballReportPage() {
  const start = formatUTCDate(
    startOfDay(new Date()),
    TIME_FORMATS.SUPABASE_DATETIME,
  );
  const end = formatUTCDate(
    endOfDay(new Date()),
    TIME_FORMATS.SUPABASE_DATETIME,
  );
  return (
    <div className="mt-5">
      <Suspense fallback={<Loading />}>
        <Report
          gameType={GAME_TYPE.BI_LAC}
          dateFrom={start}
          dateTo={end}
          includePayback
        />
      </Suspense>

      <div className="mt-5 text-center">
        <Button asChild variant={"secondary"}>
          <Link
            href={`/report/${GAME_TYPE.BI_LAC}`}
            className="inline-flex gap-2"
          >
            <BarChartIcon />
            <span>Thống kê</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
