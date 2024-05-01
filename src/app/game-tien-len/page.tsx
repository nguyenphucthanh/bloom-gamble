import GambleComponent from "@/components/gamble";
import { Button } from "@/components/ui/button";
import { BarChartIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import React from "react";

export default async function GameTienLen() {
  return (
    <div>
      <GambleComponent />
      <div className="mt-5 text-center">
        <Button asChild variant={"secondary"}>
          <Link href={"/game-tien-len/report"} className="inline-flex gap-2"><BarChartIcon /><span>Thống kê</span></Link>
        </Button>
      </div>
    </div>
  );
}
