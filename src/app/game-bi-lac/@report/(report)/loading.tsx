import React from "react";

export default function Loading() {
  return (
    <div className="flex items-stretch justify-center gap-3">
      <div className="h-3 animate-pulse rounded bg-slate-100"></div>
      <div className="h-3 animate-pulse rounded bg-slate-100"></div>
      <div className="h-3 animate-pulse rounded bg-slate-100"></div>
      <div className="h-3 animate-pulse rounded bg-slate-100"></div>
    </div>
  );
}
