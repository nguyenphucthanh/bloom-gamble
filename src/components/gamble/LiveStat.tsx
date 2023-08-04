import { useAppSelector } from "@/store/hooks";
import React, { FC, useState } from "react";
import { PlayerKey, selectPlayer, selectPlayerPoint } from "./gambleSlice";

import { Chart as ChartJS, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(...registerables);

const LiveState: FC = () => {
  const players = useAppSelector(selectPlayer);
  const point = useAppSelector(selectPlayerPoint);
  const [show, setShow] = useState(false);

  return (
    <>
      {!show ? (
        <button
          className="inline-flex gap-2 border-blue-500 ring ring-blue-100 rounded-full text-blue-400 p-3 fixed z-30 right-4 bottom-4 bg-white bg-opacity-50 backdrop-blur-md"
          onClick={() => setShow(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
            />
          </svg>
          <span>Live Stat</span>
        </button>
      ) : (
        <div
          className="fixed inset-0 top-auto bg-gradient-to-b from-transparent to-gray-300 backdrop-blur-md"
          onClick={() => setShow(false)}
        >
          <div className="flex gap-3 items-end justify-center relative z-50 pb-4 m-4 pr-8 bg-white rounded-xl shadow-xl">
            <Bar
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
                      callback: function (value) {
                        const v = parseInt(value.toString());
                        if (v == 0) return "";
                        if (v > 0)
                          return new Array(Math.floor(v / 20) || 1)
                            .fill("$")
                            .join("");
                        if (v < -80) return "(╥﹏╥)";
                        if (v < -60) return "(@_@)";
                        if (v < -40) return '("･ω･")';
                        if (v < -20) return "⊙︿⊙";
                      },
                    },
                  },
                },
              }}
              data={{
                labels: Object.values(players),
                datasets: [
                  {
                    label: "Có tiền",
                    data: ["A", "B", "C", "D"].map((key: string) =>
                      point[key as PlayerKey] > 0 ? point[key as PlayerKey] : 0
                    ),
                    backgroundColor: "rgb(96, 146, 255, 0.5)",
                    borderColor: "rgb(0, 80, 255)",
                    borderWidth: 1,
                  },
                  {
                    label: "Có nợ",
                    data: ["A", "B", "C", "D"].map((key: string) =>
                      point[key as PlayerKey] < 0 ? point[key as PlayerKey] : 0
                    ),
                    backgroundColor: "rgb(255, 119, 119, 0.5)",
                    borderColor: "rgb(255, 0, 0)",
                    borderWidth: 1,
                  },
                ],
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default LiveState;
