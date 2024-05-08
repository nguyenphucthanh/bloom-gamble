import React from "react";

export default function Loading() {
  return (
    <main>
      <div className="flex flex-col items-stretch gap-3">
        <div className="h-3 animate-pulse rounded bg-slate-100"></div>
        <div className="h-3 animate-pulse rounded bg-slate-100"></div>
        <div className="h-3 animate-pulse rounded bg-slate-100"></div>
        <div className="h-3 animate-pulse rounded bg-slate-100"></div>
      </div>
    </main>
  );
}
