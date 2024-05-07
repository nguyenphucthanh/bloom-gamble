import React from "react";

export default function Loading() {
  return (
    <div className="my-5 grid grid-cols-7 gap-3">
      <div className="col-span-3 flex flex-col items-stretch gap-3 rounded border border-blue-300 p-3">
        <div className="h-3 animate-pulse rounded bg-slate-100"></div>
        <div className="h-3 animate-pulse rounded bg-slate-100"></div>
      </div>
      <div></div>
      <div className="col-span-3 flex flex-col items-stretch gap-3 rounded border border-red-300 p-3">
        <div className="h-3 animate-pulse rounded bg-slate-100"></div>
        <div className="h-3 animate-pulse rounded bg-slate-100"></div>
      </div>
    </div>
  );
}
