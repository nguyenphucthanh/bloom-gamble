import React, { Suspense } from "react";
import Report from "@/components/Report";
import { GAME_TYPE } from "@/consts";
import { endOfDay, startOfDay } from "date-fns";
import Loading from "./loading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BarChartIcon } from "lucide-react";
import { TIME_FORMATS, formatUTCDate } from "@/lib/datetime";
import FoosballGamesList from "@/components/foosball/foosball-games-list";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";

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
      <Tabs defaultValue="games">
        <TabsList>
          <TabsTrigger value="games">Lượt đấu</TabsTrigger>
          <TabsTrigger value="points">Bảng điểm</TabsTrigger>
        </TabsList>
        <TabsContent value="games">
          <Suspense fallback={<Loading />}>
            <FoosballGamesList dateFrom={start} dateTo={end} className="mb-5" />
          </Suspense>
        </TabsContent>
        <TabsContent value="points">
          <Suspense fallback={<Loading />}>
            <Report
              gameType={GAME_TYPE.BI_LAC}
              dateFrom={start}
              dateTo={end}
              includePayback
              className="mb-5"
            />
          </Suspense>
        </TabsContent>
      </Tabs>

      <div className="text-center">
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
