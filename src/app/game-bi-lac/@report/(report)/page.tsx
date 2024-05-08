import React, { Suspense } from "react";
import Report from "@/components/Report";
import { GAME_TYPE } from "@/consts";
import { format } from "date-fns";
import Loading from "./loading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BarChartIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export const revalidate = 0;

export default function FoosballReportPage() {
  const today = format(new Date(), "yyyy-MM-dd");
  return (
    <div className="mt-5">
      <Suspense fallback={<Loading />}>
        <Report gameType={GAME_TYPE.BI_LAC} dateFrom={today} dateTo={today} />
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
