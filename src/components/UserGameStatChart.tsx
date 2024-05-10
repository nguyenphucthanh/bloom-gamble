"use client";
import React, { useMemo } from "react";

import { Chart as ChartJS, registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import { QuickUserGamePoint } from "@/models/game";
import { format } from "date-fns";
import { TIME_FORMATS } from "@/lib/datetime";
ChartJS.register(...registerables);

export type UserGameStatChartProps = {
  records: QuickUserGamePoint[];
};

export default function UserGameStatChart({ records }: UserGameStatChartProps) {
  const labels = useMemo(() => {
    return records.map((record) =>
      format(new Date(record.gameDate ?? ""), TIME_FORMATS.DISPLAY_DATE),
    );
  }, [records]);

  const points = useMemo(() => {
    return records.map((record) => record.point);
  }, [records]);

  if (records.length === 0) {
    return (
      <div className="my-4 rounded-lg bg-slate-50 p-4 text-center text-slate-500">
        No Records
      </div>
    );
  }

  return (
    <div className="my-4 rounded-lg bg-slate-50 p-4 text-center">
      <Line
        options={{
          scales: {
            x: {
              stacked: true,
              grid: {
                display: false,
              },
            },
            y: {
              stacked: true,
            },
          },
        }}
        data={{
          labels,
          datasets: [
            {
              label: "Point",
              data: points,
              backgroundColor: "rgb(96, 146, 255, 0.5)",
              borderColor: "rgb(0, 80, 255)",
              borderWidth: 1,
            },
          ],
        }}
      />
    </div>
  );
}
