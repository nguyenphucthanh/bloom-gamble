import React, { Suspense } from "react";
import Report from "@/components/Report";
import { GAME_TYPE } from "@/consts";
import { format } from "date-fns";
import Loading from "./loading";

export const dynamic = "force-dynamic";

export const revalidate = 0;

export default function FoosballReportPage() {
  const today = format(new Date(), "yyyy-MM-dd");
  return (
    <div className="mt-5">
      <Suspense fallback={<Loading />}>
        <Report gameType={GAME_TYPE.BI_LAC} dateFrom={today} dateTo={today} />
      </Suspense>
    </div>
  );
}
