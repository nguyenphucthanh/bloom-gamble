"use client";
import React, { useMemo } from "react";

import { Chart as ChartJS, registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import { QuickUserGamePoint } from "@/models/game";
import { format } from "date-fns";
import { TIME_FORMATS, formatLocalDate } from "@/lib/datetime";
import { isAfter, isBefore } from "date-fns";
ChartJS.register(...registerables);

export type UserGameStatChartProps = {
  records: QuickUserGamePoint[];
};

export default function UserGameStatChart({ records }: UserGameStatChartProps) {
  const sortedRecordsByGameDate = useMemo(() => {
    return records
      .sort((a, b) => {
        const dateA = new Date(a.gameDate ?? "");
        const dateB = new Date(b.gameDate ?? "");
        if (isAfter(dateB, dateA)) {
          return -1;
        } else if (isBefore(dateB, dateA)) {
          return 1;
        } else {
          return 0;
        }
      })
      .reduce((previous: QuickUserGamePoint[], current: QuickUserGamePoint) => {
        const currentDate = formatLocalDate(
          current.gameDate ?? "",
          TIME_FORMATS.SUPABASE_DATE,
        );
        const find: QuickUserGamePoint | undefined | null = previous.find(
          (item: QuickUserGamePoint) => item.gameDate === currentDate,
        );
        if (!find) {
          const newRow: QuickUserGamePoint = {
            gameDate: currentDate,
            point: current.point,
          };
          return [...previous, newRow];
        } else {
          find.point += current.point;
          return previous;
        }
      }, []);
  }, [records]);

  const labels = useMemo(() => {
    return sortedRecordsByGameDate.map((record) =>
      format(new Date(record.gameDate ?? ""), TIME_FORMATS.DISPLAY_DATE),
    );
  }, [sortedRecordsByGameDate]);

  const points = useMemo(() => {
    return sortedRecordsByGameDate.map((record) => record.point);
  }, [sortedRecordsByGameDate]);

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
              ticks: {
                stepSize: 10,
              },
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
